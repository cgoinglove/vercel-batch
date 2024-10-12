export default function CrossLine(props: { className?: string }) {
  return (
    <div className={`${props.className} w-5 h-5 z-10`}>
      <div className='w-full h-full relative flex flex-col'>
        <div className='flex-1 border-b-[1px] border-white/70 -rotate-90 origin-bottom' />
        <div className='flex-1 border-t-[1px] border-white/70' />
      </div>
    </div>
  )
}
