import { db } from '@/db'import { Invoices } from '@/db/schema'import {and, eq} from "drizzle-orm"import { Badge } from "@/components/ui/badge"import {cn} from "@/lib/utils"import { notFound } from "next/navigation"import {auth} from "@clerk/nextjs/server";import Container from "@/components/Container";import {ChevronDown, Ellipsis, Trash2} from 'lucide-react'import {  Dialog,  DialogContent,  DialogDescription, DialogFooter,  DialogHeader,  DialogTitle,  DialogTrigger,} from "@/components/ui/dialog"import {  DropdownMenu,  DropdownMenuContent,  DropdownMenuItem,  DropdownMenuLabel,  DropdownMenuSeparator,  DropdownMenuTrigger,} from "@/components/ui/dropdown-menu"import {Button} from "@/components/ui/button";import {AVAILABLE_STATUSES} from "@/data/invoices";import {deleteInvoiceAction, updateStatusAction} from "@/app/actions";export default async function InvoicePage({ params }) {  // const invoiceId = parseInt(params.invoiceId)  const { invoiceId } = await params;  const invoiceIdInt = parseInt(invoiceId);  const { userId } = await auth()  if(!userId) {    return  }  if(isNaN(invoiceId)) {    throw new Error('Invalid invoice ID')  }  const [result] = await db.select()    .from(Invoices)    .where(      and(        eq(Invoices.id, invoiceIdInt),        eq(Invoices.userId, userId)      )    )    .limit(1)  if(!result) {    notFound()  }  console.log(userId)  console.log(invoiceId)  console.log(result)  return (    <main className='w-full h-full'>      <Container>        <div className="flex justify-between mb-8">          <h1 className="flex items-center gap-4 text-3xl font-semibold">            Invoice {invoiceId}            <Badge className={cn(              'rounded-full capitalize',              result.status === 'open' && 'bg-blue-500',              result.status === 'paid' && 'bg-green-500',              result.status === 'void' && 'bg-zinc-700',              result.status === 'uncollectible' && 'bg-red-600'            )            }>              {result.status}            </Badge>          </h1>          {/*<DropdownMenu>*/}          {/*  <DropdownMenuTrigger>*/}          {/*    /!*<Button className='flex items-center gap-2' variant='outline'>Change Status</Button>*!/*/}          {/*    <Button variant="outline">Button</Button>*/}          {/*  </DropdownMenuTrigger>*/}          {/*  <DropdownMenuContent>*/}          {/*    <DropdownMenuLabel>My Account</DropdownMenuLabel>*/}          {/*    <DropdownMenuSeparator />*/}          {/*    <DropdownMenuItem>Profile</DropdownMenuItem>*/}          {/*    <DropdownMenuItem>Billing</DropdownMenuItem>*/}          {/*    <DropdownMenuItem>Team</DropdownMenuItem>*/}          {/*    <DropdownMenuItem>Subscription</DropdownMenuItem>*/}          {/*  </DropdownMenuContent>*/}          {/*</DropdownMenu>*/}          <div className='flex gap-2'>            <DropdownMenu>              <DropdownMenuTrigger >                <Button className='flex items-center gap-2' variant='outline'>                  Change Status                  <ChevronDown className='w-4 h-auto'/>                </Button>              </DropdownMenuTrigger>              <DropdownMenuContent>                {AVAILABLE_STATUSES.map(status => (                  <DropdownMenuItem key={status.id}>                    <form action={updateStatusAction}>                      <input type="hidden" name='id' value={invoiceId}/>                      <input type="hidden" name='status' value={status.id}/>                      <button>{status.label}</button>                    </form>                  </DropdownMenuItem>                ))}              </DropdownMenuContent>            </DropdownMenu>            <Dialog>              <DropdownMenu>                <DropdownMenuTrigger >                  <Button className='flex items-center gap-2' variant='outline'>                    <span className='sr-only'>More Options</span>                    <Ellipsis className='w-4 h-auto'/>                    <ChevronDown className='w-4 h-auto'/>                  </Button>                </DropdownMenuTrigger>                <DropdownMenuContent>                  <DropdownMenuItem>                    <DialogTrigger >                      <button className='flex gap-2 items-center'>                        <Trash2 className='w-4 h-auto'/>                        Delete Invoice                      </button>                    </DialogTrigger>                  </DropdownMenuItem>                </DropdownMenuContent>              </DropdownMenu>              <DialogContent>                <DialogHeader className='gap-2 items-center'>                  <DialogTitle className='text-3xl'>Delete Invoice?</DialogTitle>                  <DialogDescription className='text-center'>                    This action cannot be undone. This will permanently delete your account                    and remove your data from our servers.                  </DialogDescription>                  <DialogFooter>                    <form action={deleteInvoiceAction}>                      <input type="hidden" name='id' value={invoiceId}/>                      <Button variant='destructive' className='flex gap-2 items-center'>                        <Trash2 className='w-4 h-auto'/>                        Delete Invoice                      </Button>                    </form>                  </DialogFooter>                </DialogHeader>              </DialogContent>            </Dialog>          </div>        </div>        <p className='text-3xl mb-3'>          ${(result.value / 100).toFixed(2)}        </p>        <p className='text-lg mb-8'>        {result.description}        </p>        <h2 className='font-bold text-lg mb-4'>          Billing Details        </h2>        <ul className='grid gap-2'>          <li className='flex gap-4'>            <strong className='block w-28 flex-shrink-0 font-medium text-sm'>Invoice ID</strong>            <span>{invoiceId}</span>          </li>          <li className='flex gap-4'>            <strong className='block w-28 flex-shrink-0 font-medium text-sm'>Invoice Date</strong>            <span>{new Date(result.createTS).toLocaleDateString()}</span>          </li>          <li className='flex gap-4'>            <strong className='block w-28 flex-shrink-0 font-medium text-sm'>billing name</strong>            <span></span>          </li>          <li className='flex gap-4'>            <strong className='block w-28 flex-shrink-0 font-medium text-sm'>billing email</strong>            <span></span>          </li>        </ul>      </Container>    </main>  );}