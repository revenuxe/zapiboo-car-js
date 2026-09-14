import { Suspense } from "react";
import { pageMetadata } from "@/lib/metadata";
import { BookingConfirmation } from "@/components/repair/BookingConfirmation";

export const metadata = pageMetadata(
  "/repair/booking-confirmed",
  "Repair booking request received | Zapiboo",
  "Your repair booking request has been received.",
  true,
);

export default function RepairBookingConfirmedPage() {
  return (
    <Suspense>
      <BookingConfirmation />
    </Suspense>
  );
}
