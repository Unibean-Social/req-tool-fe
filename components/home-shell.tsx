"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
} from "recharts";
import {
  ChevronRightIcon,
  PlusIcon,
} from "lucide-react";
import { toast } from "sonner";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { DataTable } from "@/components/ui/data-table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

type Row = { id: string; name: string; email: string };

const tableColumns: ColumnDef<Row>[] = [
  { accessorKey: "name", header: "Tên" },
  { accessorKey: "email", header: "Email" },
];

const sampleRows: Row[] = [
  { id: "1", name: "Nguyễn A", email: "a@example.com" },
  { id: "2", name: "Trần B", email: "b@example.com" },
];

const chartData = [
  { label: "T2", v: 12 },
  { label: "T3", v: 19 },
  { label: "T4", v: 8 },
  { label: "T5", v: 15 },
];

const chartConfig = {
  v: { label: "Giá trị", color: "var(--chart-1)" },
} satisfies Parameters<typeof ChartContainer>[0]["config"];

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent className="flex flex-col gap-4">{children}</CardContent>
    </Card>
  );
}

export function HomeShell() {
  const [calendarDate, setCalendarDate] = React.useState<Date | undefined>(
    new Date()
  );
  const [progress, setProgress] = React.useState(40);
  const [sliderVal, setSliderVal] = React.useState([33]);
  const [commandOpen, setCommandOpen] = React.useState(false);
  const [collapsibleOpen, setCollapsibleOpen] = React.useState(false);
  const [selectVal, setSelectVal] = React.useState("apple");

  React.useEffect(() => {
    const t = window.setInterval(() => {
      setProgress((p) => (p >= 100 ? 12 : p + 8));
    }, 1200);
    return () => clearInterval(t);
  }, []);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 p-6 pb-20">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-semibold tracking-tight">
            UI showcase
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            Bộ kiểm thử đầy đủ component shadcn. Dialog &amp; Sheet: animation trên toàn bộ overlay +
            khung (scale/fade và trượt panel), đồng bộ với trạng thái mở/đóng của Base UI.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => toast.success("Sonner")}
          >
            Toast
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setCommandOpen(true)}
          >
            Command ⌘K
          </Button>
        </div>
      </div>

      <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
        <CommandInput placeholder="Tìm chức năng…" />
        <CommandList>
          <CommandEmpty>Không thấy.</CommandEmpty>
          <CommandGroup heading="Demo">
            <CommandItem onSelect={() => toast.info("Gợi ý 1")}>
              Gợi ý 1
            </CommandItem>
            <CommandItem onSelect={() => setCommandOpen(false)}>
              Đóng palette
              <CommandShortcut>Esc</CommandShortcut>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Khác">
            <CommandItem>Mục phụ</CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      <Section title="Button &amp; Badge" description="Biến thể nút + nhãn.">
        <div className="flex flex-wrap gap-2">
          <Button size="sm">Default</Button>
          <Button size="sm" variant="secondary">
            Secondary
          </Button>
          <Button size="sm" variant="destructive">
            Destructive
          </Button>
          <Button size="sm" variant="outline">
            Outline
          </Button>
          <Button size="sm" variant="ghost">
            Ghost
          </Button>
          <Button size="sm" variant="link">
            Link
          </Button>
          <Button size="icon-sm" variant="outline" aria-label="Thêm">
            <PlusIcon className="size-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge>Mặc định</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Lỗi</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
      </Section>

      <Section title="Alert">
        <Alert>
          <AlertTitle>Chú ý</AlertTitle>
          <AlertDescription>
            Đây là alert mặc định để kiểm tra typography và màu.
          </AlertDescription>
        </Alert>
        <Alert variant="destructive">
          <AlertTitle>Có lỗi</AlertTitle>
          <AlertDescription>Mô tả lỗi ngắn gọn.</AlertDescription>
        </Alert>
      </Section>

      <Section title="Avatar &amp; Skeleton">
        <div className="flex flex-wrap items-center gap-4">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="Demo" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </Section>

      <Section title="Breadcrumb">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Trang chủ</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Thư mục</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Hiện tại</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </Section>

      <div className="grid gap-6 lg:grid-cols-2">
        <Section title="Dialog" description="Overlay fade + hộp scale/opacity (toàn panel).">
          <Dialog>
            <DialogTrigger render={<Button variant="outline" />}>
              Mở dialog
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tiêu đề</DialogTitle>
                <DialogDescription>
                  Kiểm tra đóng bằng ESC, click nền, nút X — hiệu ứng áp dụng cho cả nền và khung.
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </Section>

        <Section title="Alert dialog">
          <AlertDialog>
            <AlertDialogTrigger render={<Button variant="outline" />}>
              Xác nhận
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Xóa mục?</AlertDialogTitle>
                <AlertDialogDescription>
                  Hành động không hoàn tác (demo UI).
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Hủy</AlertDialogCancel>
                <AlertDialogAction onClick={() => toast.success("Đã chọn")}>
                  Tiếp tục
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </Section>
      </div>

      <Section
        title="Sheet (4 hướng)"
        description="Trượt cả tấm panel — không chỉ chữ."
      >
        <div className="flex flex-wrap gap-2">
          {(["right", "left", "top", "bottom"] as const).map((side) => (
            <Sheet key={side}>
              <SheetTrigger render={<Button variant="outline" size="sm" />}>
                Sheet {side}
              </SheetTrigger>
              <SheetContent side={side} className="p-0">
                <SheetHeader className="p-4 pb-0">
                  <SheetTitle>Phía {side}</SheetTitle>
                  <SheetDescription>
                    Panel trượt từ cạnh màn hình — transition trên toàn khối.
                  </SheetDescription>
                </SheetHeader>
                <div className="p-4 pt-2 text-sm text-muted-foreground">
                  Nội dung cuộn nếu dài…
                </div>
              </SheetContent>
            </Sheet>
          ))}
        </div>
      </Section>

      <Section title="Drawer (Vaul)">
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="outline">Mở drawer</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Tiêu đề drawer</DrawerTitle>
              <DrawerDescription>Kéo xuống hoặc đóng.</DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="outline">Đóng</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </Section>

      <Section title="Tabs">
        <Tabs defaultValue="a">
          <TabsList>
            <TabsTrigger value="a">Tab A</TabsTrigger>
            <TabsTrigger value="b">Tab B</TabsTrigger>
          </TabsList>
          <TabsContent value="a">Nội dung tab A</TabsContent>
          <TabsContent value="b">Nội dung tab B</TabsContent>
        </Tabs>
      </Section>

      <Section title="Accordion">
        <Accordion defaultValue={["one"]}>
          <AccordionItem value="one">
            <AccordionTrigger>Mục một</AccordionTrigger>
            <AccordionContent>Nội dung mở rộng.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="two">
            <AccordionTrigger>Mục hai</AccordionTrigger>
            <AccordionContent>Thêm nội dung.</AccordionContent>
          </AccordionItem>
        </Accordion>
      </Section>

      <Section title="Collapsible">
        <Collapsible open={collapsibleOpen} onOpenChange={setCollapsibleOpen}>
          <div className="flex items-center gap-2">
            <CollapsibleTrigger render={<Button variant="outline" size="sm" />}>
              {collapsibleOpen ? "Thu gọn" : "Mở rộng"}
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="mt-2 rounded-lg border p-3 text-sm text-muted-foreground">
            Đoạn ẩn/hiện.
          </CollapsibleContent>
        </Collapsible>
      </Section>

      <Section title="Form controls">
        <div className="grid gap-6 md:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="demo-input">Input</FieldLabel>
            <Input id="demo-input" placeholder="Nhập…" />
            <FieldDescription>Gợi ý nhỏ dưới field.</FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="demo-text">Textarea</FieldLabel>
            <Textarea id="demo-text" placeholder="Nhiều dòng…" />
          </Field>
          <Field>
            <FieldLabel>Chọn</FieldLabel>
            <Select
              value={selectVal}
              onValueChange={(v) => {
                if (v) setSelectVal(v);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn mục" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apple">Táo</SelectItem>
                <SelectItem value="banana">Chuối</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Checkbox id="c1" defaultChecked />
              <Label htmlFor="c1">Checkbox</Label>
            </div>
            <RadioGroup defaultValue="r1" className="flex gap-4">
              <div className="flex items-center gap-2">
                <RadioGroupItem value="r1" id="r1" />
                <Label htmlFor="r1">Radio 1</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="r2" id="r2" />
                <Label htmlFor="r2">Radio 2</Label>
              </div>
            </RadioGroup>
            <div className="flex items-center gap-2">
              <Switch id="sw" />
              <Label htmlFor="sw">Switch</Label>
            </div>
          </div>
          <Field className="md:col-span-2">
            <FieldLabel>Slider ({sliderVal[0]})</FieldLabel>
            <Slider
              value={sliderVal}
              onValueChange={(v) =>
                setSliderVal(typeof v === "number" ? [v] : Array.from(v))
              }
              max={100}
              step={1}
            />
          </Field>
          <Field>
            <FieldLabel>OTP</FieldLabel>
            <InputOTP maxLength={6} aria-label="Mã OTP">
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </Field>
        </div>
        <InputGroup className="max-w-md">
          <InputGroupAddon align="inline-start">
            <InputGroupText>https://</InputGroupText>
          </InputGroupAddon>
          <InputGroupInput placeholder="domain.com" />
        </InputGroup>
      </Section>

      <Section title="Popover · Hover card · Tooltip">
        <div className="flex flex-wrap gap-3">
          <Popover>
            <PopoverTrigger render={<Button variant="outline" />}>Popover</PopoverTrigger>
            <PopoverContent className="w-72" align="start">
              <p className="text-sm">Nội dung popover + Calendar</p>
              <Calendar
                mode="single"
                selected={calendarDate}
                onSelect={setCalendarDate}
                className="mt-2 p-0"
              />
            </PopoverContent>
          </Popover>
          <HoverCard>
            <HoverCardTrigger render={<Button variant="outline" />}>
              Hover card
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <p className="text-sm text-muted-foreground">
                Thẻ khi hover — kiểm tra delay và vị trí.
              </p>
            </HoverCardContent>
          </HoverCard>
          <Tooltip>
            <TooltipTrigger render={<Button variant="outline" />}>
              Tooltip
            </TooltipTrigger>
            <TooltipContent>Gợi ý ngắn</TooltipContent>
          </Tooltip>
        </div>
      </Section>

      <Section title="Dropdown · Context menu">
        <div className="flex flex-wrap gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="outline" />}>
              Menu
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Tài khoản</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Hồ sơ</DropdownMenuItem>
              <DropdownMenuItem>Đăng xuất</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <ContextMenu>
            <ContextMenuTrigger className="flex rounded-lg border border-dashed px-6 py-8 text-sm text-muted-foreground">
              Chuột phải vào đây
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem>Sao chép</ContextMenuItem>
              <ContextMenuItem>Dán</ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        </div>
      </Section>

      <Section title="Menubar">
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>Tệp</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>Mới</MenubarItem>
              <MenubarSeparator />
              <MenubarItem>Thoát</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>Sửa</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>Undo</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </Section>

      <Section title="Navigation menu">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Sản phẩm</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-48 gap-2 p-2">
                  <li>
                    <NavigationMenuLink href="#" className="block rounded-md p-2 hover:bg-muted">
                      Mục A
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink href="#" className="block rounded-md p-2 hover:bg-muted">
                      Mục B
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href="#" className="px-3 py-2">
                Liên hệ
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </Section>

      <Section title="Pagination">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </Section>

      <Section title="Progress">
        <Progress value={progress} />
      </Section>

      <Section title="Separator">
        <div className="space-y-2 text-sm">
          <span>Trên</span>
          <Separator />
          <span>Dưới</span>
        </div>
      </Section>

      <Section title="Scroll area" description="Vùng cuộn cố định chiều cao.">
        <ScrollArea className="h-32 w-full rounded-xl border">
          <div className="space-y-2 p-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <p key={i} className="text-sm">
                Dòng {i + 1} — nội dung dài để cuộn.
              </p>
            ))}
          </div>
        </ScrollArea>
      </Section>

      <Section title="Toggle · Toggle group">
        <div className="flex flex-wrap items-center gap-3">
          <Toggle aria-label="In đậm">B</Toggle>
          <ToggleGroup size="sm" defaultValue={["bold"]}>
            <ToggleGroupItem value="bold">Đậm</ToggleGroupItem>
            <ToggleGroupItem value="italic">Nghiêng</ToggleGroupItem>
          </ToggleGroup>
        </div>
      </Section>

      <Section title="Table (đơn)" description="Bảng tĩnh + Data table (TanStack).">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên</TableHead>
              <TableHead>Email</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sampleRows.map((r) => (
              <TableRow key={r.id}>
                <TableCell>{r.name}</TableCell>
                <TableCell>{r.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <DataTable
          columns={tableColumns}
          data={sampleRows}
          searchColumn="email"
          searchPlaceholder="Lọc email…"
        />
      </Section>

      <Section title="Carousel">
        <Carousel className="max-w-md">
          <CarouselContent>
            {[1, 2, 3].map((i) => (
              <CarouselItem key={i}>
                <Card>
                  <CardContent className="flex aspect-video items-center justify-center text-2xl font-medium">
                    Slide {i}
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="static translate-none" />
          <CarouselNext className="static translate-none" />
        </Carousel>
      </Section>

      <Section title="Calendar (standalone)">
        <Calendar mode="single" selected={calendarDate} onSelect={setCalendarDate} />
      </Section>

      <Section title="Chart (Recharts)">
        <ChartContainer config={chartConfig} className="h-48 w-full max-w-lg">
          <BarChart data={chartData} accessibilityLayer>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="label" tickLine={false} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="v" fill="var(--color-v)" radius={4} />
          </BarChart>
        </ChartContainer>
      </Section>

      <Section title="Aspect ratio">
        <div className="max-w-sm">
          <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-xl bg-muted">
            <div className="flex size-full items-center justify-center text-sm text-muted-foreground">
              16:9
            </div>
          </AspectRatio>
        </div>
      </Section>

      <Section title="Command (trong popover)">
        <Popover>
          <PopoverTrigger render={<Button variant="outline" />}>Mở command</PopoverTrigger>
          <PopoverContent className="w-96 p-0" align="start">
            <Command>
              <CommandInput placeholder="Gõ…" />
              <CommandList>
                <CommandGroup heading="Ví dụ">
                  <CommandItem>
                    <ChevronRightIcon className="size-4" />
                    Một
                  </CommandItem>
                  <CommandItem>Hai</CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </Section>

      <Card>
        <CardHeader>
          <CardTitle>Card footer</CardTitle>
          <CardDescription>Ví dụ footer + nút.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Nội dung card.</p>
        </CardContent>
        <CardFooter className="justify-end gap-2">
          <Button variant="outline" size="sm">
            Hủy
          </Button>
          <Button size="sm">Lưu</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
