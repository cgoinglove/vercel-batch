import CrossLine from './cross-line'

export default function Footer() {
  return (
    <footer className='w-full border-t translate-y-[-1px] transition-colors hover:bg-white/5'>
      <div className='relative py-8 max-w-[1000px] mx-auto px-4 '>
        <CrossLine className='absolute right-[-11px] top-[-11px] hidden md:block' />
        <p className='text-right px-4 text-sm text-white/40'>
          © {new Date().getFullYear()} <span className='text-white font-semibold'>Cgoing</span>
          <span className='text-orange-400 font-bold'>.</span> All rights reserved.
        </p>
      </div>
    </footer>
  )
}
