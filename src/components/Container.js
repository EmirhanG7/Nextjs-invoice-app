import {cn} from "@/lib/utils";

export default function Container({ children, className, ...props }) {
  return (
    <div {...props} className={cn('max-w-5xl mx-auto px-5', className)}>
      {children}
    </div>
  )
}