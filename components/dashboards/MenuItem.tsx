import { ReactNode, useContext } from 'react';

import { useRouter } from 'next/navigation';

import { SideBarContext } from './SideBar';

const MenuItem = ({
  children,
  leadingIcon,
  trailingIcon,
  route,
  disabled = false,
  onClick,
}: {
  children: ReactNode;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  route?: string;
  disabled?: boolean;
  onClick?: () => void;
}) => {
  const { activePath, expanded } = useContext(SideBarContext);
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (route) {
      router.push(route);
    }
  };

  return (
    <button
      className={`pr-4 ${leadingIcon && expanded ? 'pl-4' : 'pl-10'}  flex select-none flex-row items-center gap-2 rounded-br rounded-tr py-2 justify-between text-nowrap w-full ${
        !disabled
          ? 'cursor-pointer hover:bg-white'
          : 'opacity-25 cursor-not-allowed'
      } ${activePath === route ? 'border-r-2 border-orange-500 bg-white' : 'bg-wm-white-50'}`}
      onClick={handleClick}
      disabled={disabled}
    >
      {leadingIcon && <div className="h-4 w-4">{leadingIcon}</div>}
      {expanded && children}
      {trailingIcon && <div className="h-4 w-4">{trailingIcon}</div>}
    </button>
  );
};

export default MenuItem;
