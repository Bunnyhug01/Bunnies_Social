import Image from 'next/image'


interface Props {
  imgSrc: string,
}


export default function Collection({ imgSrc } : Props) {
  return (
    <div className='relative min-w-[250px] max-h-[140px] w-[250px] h-[100%] rounded-lg mx-2 overflow-hidden'>
      <Image
            src={imgSrc}
            width={0}
            height={0}
            sizes="100vw"
            alt=""
            className='w-full h-full object-cover'
        />

        <div className='w-full h-[40px] bg-collectionBg absolute bottom-0 flex items-center px-2'>
            <h2 className='text-textColor text-[16px] font-bold'>Nature</h2>
        </div>
    </div>
  )
}