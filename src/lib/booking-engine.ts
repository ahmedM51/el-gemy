import { Appointment, Barber } from '../types';

export interface TimeSlot {
  time: string; // "14:30"
  displayTime: string; // "02:30 م"
  available: boolean;
  reason?: string;
}

/**
 * Generate 30-minute interval slots and verify collision against existing appointments
 */
export function generateAvailableSlots(
  dateStr: string,
  totalDurationMinutes: number,
  existingAppointments: Appointment[],
  selectedBarberId?: string,
  openingHour = 10,
  closingHour = 23
): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const bufferMinutes = 5;
  const serviceSpan = totalDurationMinutes + bufferMinutes;

  // Generate slots from opening to closing at 30-min steps
  for (let hour = openingHour; hour <= closingHour; hour++) {
    for (const minute of [0, 30]) {
      if (hour === closingHour && minute > 30) continue;

      const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      const slotStartMinutes = hour * 60 + minute;
      const slotEndMinutes = slotStartMinutes + serviceSpan;

      // Close check
      if (slotEndMinutes > (closingHour + 1) * 60) {
        continue;
      }

      // Check collision with existing active appointments for the given date and barber
      const hasConflict = existingAppointments.some((appt) => {
        // Only active statuses cause collision
        if (!['PENDING', 'CONFIRMED', 'ARRIVED', 'IN_SERVICE'].includes(appt.status)) {
          return false;
        }

        // Must match date
        if (appt.date !== dateStr) {
          return false;
        }

        // If a specific barber is chosen, check conflicts for that barber only
        if (selectedBarberId && selectedBarberId !== 'any' && appt.barber_id !== selectedBarberId) {
          return false;
        }

        const [apptStartH, apptStartM] = appt.start_time.split(':').map(Number);
        const [apptEndH, apptEndM] = appt.end_time.split(':').map(Number);
        const apptStartMinutes = apptStartH * 60 + apptStartM;
        const apptEndMinutes = apptEndH * 60 + apptEndM;

        // Standard interval intersection check: [slotStart, slotEnd) intersects [apptStart, apptEnd)
        return slotStartMinutes < apptEndMinutes && slotEndMinutes > apptStartMinutes;
      });

      // Format Arabic & English display time (12-hour format)
      const periodAr = hour >= 12 ? 'م' : 'ص';
      const displayHour = hour % 12 === 0 ? 12 : hour % 12;
      const displayTimeAr = `${displayHour}:${minute.toString().padStart(2, '0')} ${periodAr}`;

      slots.push({
        time: timeStr,
        displayTime: displayTimeAr,
        available: !hasConflict,
        reason: hasConflict ? 'محجوز مسبقاً' : undefined,
      });
    }
  }

  return slots;
}

/**
 * Calculates end time based on start time and total minutes
 */
export function calculateEndTime(startTime: string, durationMinutes: number): string {
  const [h, m] = startTime.split(':').map(Number);
  const total = h * 60 + m + durationMinutes;
  const endH = Math.floor(total / 60);
  const endM = total % 60;
  return `${endH.toString().padStart(2, '0')}:${endM.toString().padStart(2, '0')}`;
}

/**
 * Generate unique appointment ticket code
 */
export function generateAppointmentNumber(): string {
  const prefix = 'GMY';
  const random = Math.floor(1000 + Math.random() * 9000);
  const dateTag = new Date().toISOString().slice(2, 7).replace('-', '');
  return `${prefix}-${dateTag}-${random}`;
}
