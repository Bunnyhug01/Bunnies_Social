interface Props {
    icon: JSX.Element,
    name: string
}

export default function MenuItem({icon, name} : Props) {
  return (
    <div className="group flex items-center cursor-pointer relative">
        <i className="text-gray-500 scale-125 group-hover:text-textColor">
            {icon}
        </i>
        <div className="hidden group-hover:block z-50 absolute left-12 bg-textColor px-4 py-1 rounded-md
            before:absolute before:w-[15px] before:h-[15px] before:rounded before:bg-textColor
            before:left-[-6px] before:top-2 before:rotate-45
        ">
            <p className="text-mainBg">
                {name}
            </p>
        </div>
    </div>
  )
}