import Image from 'next/image';
import logo from '../app/assets/icons/logo.png';
import Link from 'next/link';

const Navbar = () => {
  return (
    <header className='flex justify-between px-6 '>
       <div className='flex p-6'>
          <Image src={logo} alt='logo' />
          <p>DevEvent</p>
       </div>

       <ul className='flex gap-8 list-none'>
         <Link href={'/'}>Home</Link>
         <Link href={'/'}>Events</Link>
         <Link href={'/'}>create Event</Link>
       </ul>
    </header>
  )
}

export default Navbar