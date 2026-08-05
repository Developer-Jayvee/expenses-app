import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@c/lib/shadcn/components/ui/dropdown-menu";

interface ItemsDetailsI {
    label : string;
    event ?: () => void;
    className ?: string;
}
interface OptionsI {
    label ?: string;
    items : Array<ItemsDetailsI>;
}
interface DropMenuI {
    children : React.ReactNode;
    options :  Array<OptionsI>;
}

export default function DropMenu({
    children,
    options
} : DropMenuI) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger >
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {
            options && options.map((items : OptionsI, index : number) => (
                <DropdownMenuGroup key={index}>
                    { items.label && (<DropdownMenuLabel>{items?.label}</DropdownMenuLabel>)}
                    {
                        items.items && items.items.map((opt: ItemsDetailsI, optIndex : number) => (
                            <DropdownMenuItem key={optIndex} className={opt.className} onClick={() => opt.event?.()}>{opt.label}</DropdownMenuItem>
                        ))
                    }
                    {
                        (index + 1) < options.length && (
                            <DropdownMenuSeparator/>
                        )
                    }
                </DropdownMenuGroup>
            ))
        }
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
