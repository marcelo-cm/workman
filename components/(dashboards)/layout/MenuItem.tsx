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
      className={`pr-4 ${leadingIcon && expanded ? 'pl-4' : 'pl-10'}  flex w-full select-none flex-row items-center justify-between gap-2 text-nowrap rounded-br rounded-tr py-2 ${
        !disabled
          ? 'cursor-pointer hover:bg-white'
          : 'cursor-not-allowed opacity-25'
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
