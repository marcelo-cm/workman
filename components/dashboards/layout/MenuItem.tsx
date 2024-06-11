import { ReactNode, useContext } from 'react';
import { SideBarContext } from './SideBar';
import { useRouter } from 'next/navigation';

const MenuItem = ({
  children,
  icon = false,
  href,
  disabled = false,
  onClick,
}: {
  children: ReactNode;
  href?: string;
  icon?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) => {
  const { activePath } = useContext(SideBarContext);
  const router = useRouter();
  return (
    <div
      className={`
    pr-4 ${icon ? 'pl-4' : 'pl-10'} flex 
    select-none flex-row items-center
    gap-2 rounded-br 
    rounded-tr 
     py-2
    ${!disabled ? 'cursor-pointer hover:bg-white' : null}
    ${
      activePath == href
        ? 'border-r-2 border-orange-500 bg-white'
        : 'bg-wm-white-50'
    }`}
      onClick={onClick ? onClick : () => (href ? router.push(href) : null)}
    >
      {children}
    </div>
  );
};

export default MenuItem;
