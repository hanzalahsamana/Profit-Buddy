import React from 'react'
import ContentLoader from 'react-content-loader'

const ProductCardLoader = (props) => (
    <div className='flex items-center  gap-4 border border-border rounded-[18px] bg-primary h-[180px]'>
        <div className='h-[150px] w-[55px] pl-4'>
            <ContentLoader
                speed={1}
                width={45}
                height={150}
                viewBox="0 0 45 150"
                backgroundColor="#ededeb90"
                foregroundColor="#e8e8e3"
                {...props}
            >
                <rect x="0%" y="0" rx="5" ry="5" width="45px" height="45px" />
                <rect x="0%" y="53" rx="5" ry="5" width="45px" height="45px" />
                <rect x="0%" y="105" rx="5" ry="5" width="45px" height="45px" />
            </ContentLoader>
        </div>
        <div className='h-[150px] w-[150px]'>
            <ContentLoader
                speed={1}
                width={150}
                height={150}
                viewBox="0 0 150 150"
                backgroundColor="#ededeb90"
                foregroundColor="#e8e8e3"
                {...props}
            >
                <rect x="0%" y="0" rx="5" ry="5" width="150px" height="150px" />
            </ContentLoader>
        </div>
        <div className='h-[150px] flex-1 max-w-[500px]'>
            <ContentLoader
                speed={1}
                width={"100%"}
                height={150}
                viewBox="0 0 100% 150"
                backgroundColor="#ededeb90"
                foregroundColor="#e8e8e3"
                {...props}
            >
                <rect x="0%" y="0" rx="5" ry="5" width="100%" height="30" />
                <rect x="0%" y="60" rx="5" ry="5" width="60%" height="15" />
                <rect x="0%" y="100" rx="5" ry="5" width="30%" height="15" />
                <rect x="40%" y="100" rx="5" ry="5" width="30%" height="15" />
                <rect x="0%" y="140" rx="5" ry="5" width="60%" height="10" />
            </ContentLoader>
        </div>
         {/* <div className='h-[150px] w-[300px]'>
            <ContentLoader
                speed={1}
                width={300}
                height={150}
                viewBox="0 0 300 150"
                backgroundColor="#ededeb90"
                foregroundColor="#e8e8e3"
                {...props}
            >
                <rect x="0%" y="0" rx="5" ry="5" width="300px" height="150px" />
            </ContentLoader>
        </div> */}
    </div>
)

export default ProductCardLoader;
