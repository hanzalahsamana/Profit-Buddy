import React from 'react'
import ContentLoader from 'react-content-loader'

const ProductCardLoader = (props) => (
    <div className='flex items-center  gap-4 border border-border rounded-[18px] bg-primary h-[230px]'>
        <div className='h-[200px] w-[60px] pl-4'>
            <ContentLoader
                speed={1}
                width={60}
                height={200}
                viewBox="0 0 60 200"
                backgroundColor="#ededeb90"
                foregroundColor="#e8e8e3"
                {...props}
            >
                <rect x="0%" y="0" rx="5" ry="5" width="60px" height="60px" />
                <rect x="0%" y="70" rx="5" ry="5" width="60px" height="60px" />
                <rect x="0%" y="140" rx="5" ry="5" width="60px" height="60px" />
            </ContentLoader>
        </div>
        <div className='h-[200px] w-[200px] pl-4'>
            <ContentLoader
                speed={1}
                width={200}
                height={200}
                viewBox="0 0 200 200"
                backgroundColor="#ededeb90"
                foregroundColor="#e8e8e3"
                {...props}
            >
                <rect x="0%" y="0" rx="5" ry="5" width="200px" height="200px" />
            </ContentLoader>
        </div>
        <div className='pl-2 h-[200px] flex-1 max-w-[500px]'>
            <ContentLoader
                speed={1}
                width={"100%"}
                height={200}
                viewBox="0 0 100% 200"
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
         {/* <div className='h-[200px] w-[300px]'>
            <ContentLoader
                speed={1}
                width={300}
                height={200}
                viewBox="0 0 300 200"
                backgroundColor="#ededeb90"
                foregroundColor="#e8e8e3"
                {...props}
            >
                <rect x="0%" y="0" rx="5" ry="5" width="300px" height="200px" />
            </ContentLoader>
        </div> */}
    </div>
)

export default ProductCardLoader;
