function arraysAreEqual(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b)) return false;
  if (a.length !== b.length) return false;
  return a.every((val, i) => val === b[i]);
}

function attachZoomHandlers(gs, syncOpts, prevCallbacks) {
  let block = false;
  gs.forEach((g, i) => {
    g.updateOptions(
      {
        drawCallback: function (me, initial) {
          if (block || initial) {
            const prev = prevCallbacks[i]?.drawCallback;
            if (prev) prev.apply(this, arguments);
            return;
          }
          block = true;

          let opts = { dateWindow: me.xAxisRange() };
          if (syncOpts.range) opts.valueRange = me.yAxisRange();

          gs.forEach((other, j) => {
            if (other === me) {
              const prev = prevCallbacks[j]?.drawCallback;
              if (prev) prev.apply(this, arguments);
              return;
            }
            let update = !arraysAreEqual(opts.dateWindow, other.getOption('dateWindow'));
            if (!update && syncOpts.range) {
              update = !arraysAreEqual(opts.valueRange, other.getOption('valueRange'));
            }
            if (update) {
              if (!syncOpts.range) opts.valueRange = other.yAxisRange();
              other.updateOptions(opts);
            }
          });
          block = false;
        },
      },
      true
    );
  });
}

function attachSelectionHandlers(gs, prevCallbacks) {
  let block = false;
  gs.forEach((g, i) => {
    g.updateOptions(
      {
        highlightCallback: function (event, x, points, row, seriesName) {
          if (block) return;
          block = true;
          gs.forEach((other, j) => {
            if (other === g) {
              const prev = prevCallbacks[j]?.highlightCallback;
              if (prev) prev.apply(this, arguments);
              return;
            }
            const idx = other.getRowForX(x);
            if (idx !== null) {
              other.setSelection(idx, seriesName, undefined, true);
            }
          });
          block = false;
        },
        unhighlightCallback: function () {
          if (block) return;
          block = true;
          gs.forEach((other, j) => {
            if (other === g) {
              const prev = prevCallbacks[j]?.unhighlightCallback;
              if (prev) prev.apply(this, arguments);
              return;
            }
            other.clearSelection();
          });
          block = false;
        },
      },
      true
    );
  });
}

function attachDragOverlaySyncX(gs) {
  let isDragging = false;
  let startX = null;

  gs.forEach((g) => {
    const parent = g.graphDiv;

    // create overlay canvas
    let overlay = parent.querySelector('.drag-overlay');
    if (!overlay) {
      overlay = document.createElement('canvas');
      overlay.className = 'drag-overlay';
      overlay.style.position = 'absolute';
      overlay.style.left = 0;
      overlay.style.top = 0;
      overlay.style.pointerEvents = 'none';
      overlay.width = g.width_;
      overlay.height = g.height_;
      parent.style.position = 'relative';
      parent.appendChild(overlay);
    }

    if (!g._overlayResizeInstalled) {
      g.resizeHandler = () => {
        const ov = g.graphDiv.querySelector('.drag-overlay');
        if (ov) {
          ov.width = g.width_;
          ov.height = g.height_;
        }
      };
      g._overlayResizeInstalled = true;
    }
    const canvas = g.canvas_;

    const endDragFor = (sourceGraph) => {
      // stop dragging and clear overlays
      isDragging = false;
      startX = null;
      dragSource = null;

      gs.forEach((other) => {
        const ov = other.graphDiv.querySelector('.drag-overlay');
        if (ov) {
          const ctx = ov.getContext('2d');
          ctx.clearRect(0, 0, ov.width, ov.height);
        }
      });

      // remove ephemeral listeners attached for this source graph
      const handlers = ephemeralHandlers.get(sourceGraph);
      if (handlers) {
        if (handlers.winUp) window.removeEventListener('mouseup', handlers.winUp);
        if (handlers.leave) sourceGraph.graphDiv.removeEventListener('mouseleave', handlers.leave);
        ephemeralHandlers.delete(sourceGraph);
      }
    };

    canvas.addEventListener('mousedown', (e) => {
      const coords = g.eventToDomCoords(e);
      startX = coords[0];
      isDragging = true;
    });

    canvas.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const coords = g.eventToDomCoords(e);
      const endX = coords[0];

      gs.forEach((other) => {
        const overlay2 = other.graphDiv.querySelector('.drag-overlay');
        const ctx2 = overlay2.getContext('2d');
        const area = other.getArea(); // plot area

        ctx2.clearRect(0, 0, overlay2.width, overlay2.height);

        const x0 = Math.max(Math.min(startX, endX), area.x); // clip to plot area
        const x1 = Math.min(Math.max(startX, endX), area.x + area.w);
        const y0 = area.y;
        const y1 = area.y + area.h;

        ctx2.save();
        ctx2.globalAlpha = 0.3;
        ctx2.fillStyle = 'gray';
        ctx2.strokeStyle = 'black';
        ctx2.fillRect(x0, y0, x1 - x0, y1 - y0);
        ctx2.strokeRect(x0, y0, x1 - x0, y1 - y0);
        ctx2.restore();
      });
    });

    canvas.addEventListener('mouseup', () => {
      isDragging = false;
      startX = null;

      gs.forEach((other) => {
        const overlay2 = other.graphDiv.querySelector('.drag-overlay');
        const ctx2 = overlay2.getContext('2d');
        ctx2.clearRect(0, 0, overlay2.width, overlay2.height);
      });
    });
  });
}

export function synchronize(graphs, opts = { selection: true, zoom: true, range: true }) {
  if (!graphs || graphs.length < 2) {
    throw new Error('Need at least two Dygraphs to synchronize.');
  }

  const gs = graphs;
  const prevCallbacks = [];

  let readyCount = gs.length;
  gs.forEach((g, i) => {
    g.ready(() => {
      if (--readyCount === 0) {
        const callbackTypes = ['drawCallback', 'highlightCallback', 'unhighlightCallback'];
        gs.forEach((graph, j) => {
          prevCallbacks[j] = {};
          callbackTypes.forEach((type) => {
            prevCallbacks[j][type] = graph.getFunctionOption(type);
          });
        });

        if (opts.zoom) {
          attachZoomHandlers(gs, opts, prevCallbacks);
          attachDragOverlaySyncX(gs);
        }
        if (opts.selection) attachSelectionHandlers(gs, prevCallbacks);
      }
    });
  });

  return {
    detach: () => {
      gs?.forEach((g, i) => {
        if (!g || !g.div) return; // skip destroyed/null graphs

        if (opts.zoom) {
          g.updateOptions({ drawCallback: prevCallbacks[i]?.drawCallback || null });
        }
        if (opts.selection) {
          g.updateOptions({
            highlightCallback: prevCallbacks[i]?.highlightCallback || null,
            unhighlightCallback: prevCallbacks[i]?.unhighlightCallback || null,
          });
        }
        const ov = g.graphDiv.querySelector('.drag-overlay');
        if (ov) {
          const ctx = ov.getContext('2d');
          ctx.clearRect(0, 0, ov.width, ov.height);
          // optional: remove overlay element
          ov.remove();
        }
      });
    },
  };
}

export function attachTooltipSync(graphs, setTooltipDatas) {
  graphs.forEach((g, i) => {
    g.updateOptions({
      highlightCallback: (event, x, points, row) => {
        graphs.forEach((other, j) => {
          const rowIndex = other.getRowForX(x);
          let tooltipData = {
            date: null,
            data: [],
          };

          if (rowIndex !== null) {
            const labels = other.getLabels(); // ['Date', 'series1', ...]
            tooltipData.date = other.getValue(rowIndex, 0); // get the date of this row

            for (let col = 1; col < labels.length; col++) {
              const yVal = other.getValue(rowIndex, col);
              if (yVal == null) continue;

              const xVal = other.getValue(rowIndex, 0);
              const [canvasX, canvasY] = other.toDomCoords(xVal, yVal);

              tooltipData.data.push({
                name: labels[col],
                yval: yVal,
                row: rowIndex,
                col,
                canvasx: canvasX,
                canvasy: canvasY,
              });
            }
          }

          // Determine tooltip position
          let tx = event.clientX;
          let ty = event.clientY;
          if (tooltipData.data.length > 0) {
            const rect = other.graphDiv.getBoundingClientRect();
            tx = rect.left + tooltipData.data[0].canvasx;
            ty = rect.top + tooltipData.data[0].canvasy;
          }

          setTooltipDatas[j]({
            x: tx,
            y: ty,
            points: { ...tooltipData },
            visible: true,
          });
        });
      },

      unhighlightCallback: () => {
        setTooltipDatas.forEach((setTooltip) => setTooltip((prev) => ({ ...prev, visible: false })));
      },
    });
  });
}
