import { describe, it, expect } from 'vitest';
import { 
  generateAvailableSlots, 
  calculateEndTime, 
  generateAppointmentNumber 
} from '../lib/booking-engine';
import { Appointment } from '../types';

describe('Booking Engine Concurrency & Slot Collision Suite', () => {
  const dummyAppointments: Appointment[] = [
    {
      id: 'appt-test-1',
      appointment_number: 'GMY-2610-9999',
      branch_id: 'branch-mit-el-nasr',
      barber_id: 'barber-elgemy',
      customer_id: 'cust-1',
      customer_name: 'أحمد التست',
      customer_phone: '01096913209',
      status: 'CONFIRMED',
      date: '2026-10-10',
      start_time: '14:00',
      end_time: '14:45',
      services: [],
      total_duration_minutes: 45,
      total_amount: 250,
      discount_amount: 0,
      final_amount: 250,
      is_walk_in: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  it('should detect slot overlap for existing appointment of chosen barber', () => {
    const slots = generateAvailableSlots(
      '2026-10-10',
      45,
      dummyAppointments,
      'barber-elgemy'
    );

    // Slot 14:00 must be marked unavailable
    const slot1400 = slots.find((s) => s.time === '14:00');
    expect(slot1400?.available).toBe(false);

    // Slot 16:00 should be free
    const slot1600 = slots.find((s) => s.time === '16:00');
    expect(slot1600?.available).toBe(true);
  });

  it('should correctly calculate end time given duration', () => {
    expect(calculateEndTime('14:00', 45)).toBe('14:45');
    expect(calculateEndTime('14:30', 60)).toBe('15:30');
    expect(calculateEndTime('23:00', 30)).toBe('23:30');
  });

  it('should generate properly formatted appointment tickets', () => {
    const ticket = generateAppointmentNumber();
    expect(ticket).toMatch(/^GMY-\d{4}-\d{4}$/);
  });
});
