import {Menu, Settings} from "lucide-react";

const Header = () => {
    return (
        <header className="border-b border-border bg-[#111318]">
            <div className="mx-auto flex h-14 max-w-[1500px] items-center justify-between px-6">

                <div>
          <span className="text-sm font-semibold text-gray-200">
            Army Builder
          </span>
                </div>

                <div className="flex items-center gap-5 text-gray-400">
                    <button className="cursor-pointer hover:text-white">
                        <Menu size={20}/>
                    </button>

                    <button className="cursor-pointer hover:text-white">
                        <Settings size={20}/>
                    </button>
                </div>

            </div>
        </header>
    )
}

export default Header;