"use client";

import { Button } from "@/components/ui/Button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/Input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { getMyPlans } from "@/services/order";
import { crateTicket } from "@/services/ticket";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
  orderId: z.string().min(1),
  subject: z.string().min(1),
  category: z.string().min(1),
  description: z.string().min(1),
});

interface CreateTicketModalProps {
  isNewTicketOpen: boolean;
  setIsNewTicketOpen: (open: boolean) => void;
}

type OrderStatus = "active" | "expired" | "cancelled";

type OrderOption = {
  _id: string;
  orderId?: string;
  package_name?: string;
  status?: string;
};

const ORDER_STATUSES: OrderStatus[] = ["active", "expired", "cancelled"];
const ORDER_LIMIT = 20;
type MyPlansResponse = {
  result?: OrderOption[];
  pagination?: {
    totalPages?: number;
  };
} | null;

export default function CreateTicketModal({
  isNewTicketOpen,
  setIsNewTicketOpen,
}: CreateTicketModalProps) {
  const t = useTranslations("Support");

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema as any),
    defaultValues: {
      orderId: "",
      subject: "",
      category: "",
      description: "",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openOrders, setOpenOrders] = useState(false);
  const [orderSearch, setOrderSearch] = useState("");
  const [orders, setOrders] = useState<OrderOption[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [isLoadingMoreOrders, setIsLoadingMoreOrders] = useState(false);
  const [hasMoreOrders, setHasMoreOrders] = useState(true);

  const pageByStatusRef = useRef<Record<OrderStatus, number>>({
    active: 1,
    expired: 1,
    cancelled: 1,
  });

  const hasMoreByStatusRef = useRef<Record<OrderStatus, boolean>>({
    active: true,
    expired: true,
    cancelled: true,
  });

  const mergeOrders = useCallback(
    (prev: OrderOption[], next: OrderOption[]) => {
      const map = new Map<string, OrderOption>();
      [...prev, ...next].forEach((order) => {
        const key = order?.orderId || order?._id;
        if (!key) return;
        map.set(key, order);
      });
      return Array.from(map.values());
    },
    [],
  );

  const resetOrderState = useCallback(() => {
    setOpenOrders(false);
    setOrderSearch("");
    setOrders([]);
    setHasMoreOrders(true);
    pageByStatusRef.current = {
      active: 1,
      expired: 1,
      cancelled: 1,
    };
    hasMoreByStatusRef.current = {
      active: true,
      expired: true,
      cancelled: true,
    };
  }, []);

  const fetchOrderPage = useCallback(
    async (isLoadMore: boolean) => {
      if (isLoadMore) {
        setIsLoadingMoreOrders(true);
      } else {
        setIsLoadingOrders(true);
      }

      try {
        const statusesToFetch = ORDER_STATUSES.filter(
          (status) => hasMoreByStatusRef.current[status],
        );

        if (statusesToFetch.length === 0) {
          setHasMoreOrders(false);
          return;
        }

        const responses = await Promise.all(
          statusesToFetch.map(async (status) => {
            const currentPage = pageByStatusRef.current[status];
            const response = (await getMyPlans({
              page: String(currentPage),
              limit: String(ORDER_LIMIT),
              status: status === "active" ? undefined : status,
            })) as MyPlansResponse;
            return { status, response, currentPage };
          }),
        );

        const fetchedOrders: OrderOption[] = [];

        responses.forEach(({ status, response, currentPage }) => {
          const result = response?.result || [];
          const pagination = response?.pagination;
          fetchedOrders.push(...result);

          const totalPages = pagination?.totalPages ?? currentPage;
          hasMoreByStatusRef.current[status] = currentPage < totalPages;
          pageByStatusRef.current[status] = currentPage + 1;
        });

        setOrders((prev) => mergeOrders(prev, fetchedOrders));
        setHasMoreOrders(
          ORDER_STATUSES.some((status) => hasMoreByStatusRef.current[status]),
        );
      } catch {
        toast.error(t("ordersLoadFailed"));
      } finally {
        if (isLoadMore) {
          setIsLoadingMoreOrders(false);
        } else {
          setIsLoadingOrders(false);
        }
      }
    },
    [mergeOrders, t],
  );

  useEffect(() => {
    if (!isNewTicketOpen) {
      form.reset();
      resetOrderState();
      return;
    }

    resetOrderState();
    void fetchOrderPage(false);
  }, [isNewTicketOpen, fetchOrderPage, form, resetOrderState]);

  const filteredOrders = useMemo(() => {
    const keyword = orderSearch.trim().toLowerCase();
    if (!keyword) return orders;

    return orders.filter((order) => {
      const orderId = order.orderId?.toLowerCase() || "";
      const id = order._id?.toLowerCase() || "";
      const packageName = order.package_name?.toLowerCase() || "";
      const status = order.status?.toLowerCase() || "";
      return (
        orderId.includes(keyword) ||
        id.includes(keyword) ||
        packageName.includes(keyword) ||
        status.includes(keyword)
      );
    });
  }, [orderSearch, orders]);
  console.log("filteredOrders", filteredOrders);
  const onSubmit = async (values: z.infer<typeof schema>) => {
    try {
      setIsSubmitting(true);

      const payload = {
        orderId: values.orderId,
        subject: values.subject,
        description: values.description,
        category: values.category,
      };

      const response = await crateTicket(payload);
      toast.success(response.message || "Ticket created successfully");
      setIsNewTicketOpen(false);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : t("ticketCreateFailed");
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isNewTicketOpen} onOpenChange={setIsNewTicketOpen}>
      <DialogContent
        className="max-w-md max-h-[85vh] flex flex-col"
        showCloseButton={false}
      >
        <div className="flex justify-between">
          <DialogTitle className="content-center">
            {t("raiseTicket")}
          </DialogTitle>
          <button
            onClick={() => setIsNewTicketOpen(false)}
            className="text-gray-500 hover:text-red-500 text-3xl cursor-pointer"
          >
            &times;
          </button>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 overflow-y-auto px-2"
          >
            <FormField
              control={form.control}
              name="orderId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("orderName")}</FormLabel>
                  <Popover open={openOrders} onOpenChange={setOpenOrders}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        {(() => {
                          const selectedOrder = orders.find(
                            (order) =>
                              (order.orderId || order._id) === field.value,
                          );

                          return (
                            <Button
                              type="button"
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-full justify-between border-input bg-white hover:bg-white text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {selectedOrder?.package_name ||
                                field.value ||
                                t("selectOrder")}
                              <ChevronsUpDown className="h-4 w-4 opacity-50" />
                            </Button>
                          );
                        })()}
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-(--radix-popover-trigger-width) p-0"
                      align="start"
                    >
                      <Command>
                        <CommandInput
                          placeholder={t("searchOrder")}
                          value={orderSearch}
                          onValueChange={setOrderSearch}
                        />
                        <CommandList
                          className="max-h-64 overflow-y-auto"
                          onScroll={(event) => {
                            const target = event.currentTarget;
                            const isNearBottom =
                              target.scrollTop + target.clientHeight >=
                              target.scrollHeight - 24;

                            if (
                              isNearBottom &&
                              hasMoreOrders &&
                              !isLoadingOrders &&
                              !isLoadingMoreOrders
                            ) {
                              void fetchOrderPage(true);
                            }
                          }}
                        >
                          {!isLoadingOrders && filteredOrders.length === 0 && (
                            <CommandEmpty>{t("noOrderFound")}</CommandEmpty>
                          )}
                          <CommandGroup>
                            {filteredOrders.map((order) => (
                              <CommandItem
                                key={order.orderId || order._id}
                                value={`${order.orderId || ""} ${order._id} ${order.package_name || ""} ${order.status || ""}`}
                                onSelect={() => {
                                  field.onChange(order.orderId || order._id);
                                  setOpenOrders(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    field.value === (order.orderId || order._id)
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                                <div className="flex w-full items-center justify-between gap-2">
                                  <span className="truncate">
                                    {order?.package_name || ""}
                                  </span>
                                  <span className="text-xs capitalize text-gray-500">
                                    {order.status || "-"}
                                  </span>
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                          {(isLoadingOrders || isLoadingMoreOrders) && (
                            <div className="py-2 text-center text-xs text-gray-500">
                              {t("loadingOrders")}
                            </div>
                          )}
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("subject")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("placeholderSubject")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2">
              <div className="flex-1">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("category")}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder={t("selectCategory")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="activation">
                            {t("activation")}
                          </SelectItem>
                          <SelectItem value="refund">{t("refund")}</SelectItem>
                          <SelectItem value="billing">
                            {t("billing")}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("description")}</FormLabel>
                  <FormControl>
                    <textarea
                      rows={3}
                      className="w-full border rounded-md p-2"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-4 justify-center">
              <Button
                type="submit"
                className="py-6 bg-primary text-white w-1/2 rounded-full"
                disabled={isSubmitting}
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {isSubmitting ? t("submittingTicket") : t("submitTicket")}
              </Button>
              <Button
                type="button"
                className="py-6 bg-black text-white w-1/2 rounded-full"
                onClick={() => setIsNewTicketOpen(false)}
              >
                {t("cancel")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
