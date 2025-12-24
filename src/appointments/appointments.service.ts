import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) {}

  async findAllSortedDesc() {
    return this.prisma.appointment.findMany({
      orderBy: { startTime: 'desc' },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            city: true,
          },
        },
      },
    });
  }

  /**
   * Erste Version „fällige Termine“:
   * - dueDate = startTime + 12 Monate
   * - Wochenenden → auf nächsten Montag verschieben
   * - Feiertage je Bundesland kommt später dazu
   */
  async findDueNextMonths() {
    const all = await this.prisma.appointment.findMany({
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            city: true,
            // später: stateCode o.ä.
          },
        },
      },
    });

    const now = new Date();

    const dueList = all
      .map((a) => {
        const due = this.addMonths(a.startTime, 12);
        const dueAdjusted = this.adjustToNextWorkingDay(due);
        return { ...a, dueDate: dueAdjusted };
      })
      .filter((a) => a.dueDate > now)
      .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());

    return dueList;
  }

  private addMonths(date: Date, months: number): Date {
    const d = new Date(date);
    const m = d.getMonth() + months;
    d.setMonth(m);

    // Monatsende-Korrektur
    if (d.getMonth() !== (m % 12 + 12) % 12) {
      d.setDate(0);
    }
    return d;
  }

  private adjustToNextWorkingDay(date: Date): Date {
    const d = new Date(date);
    while (this.isWeekend(d)) {
      d.setDate(d.getDate() + 1);
    }
    // TODO: Feiertage je Bundesland berücksichtigen
    return d;
  }

  private isWeekend(date: Date): boolean {
    const day = date.getUTCDay(); // 0 = Sonntag, 6 = Samstag
    return day === 0 || day === 6;
  }

    // Vergangene Termine (nur Startzeiten in der Vergangenheit, absteigend)
    async findPastSortedDesc() {
      return this.prisma.appointment.findMany({
        where: {
          startTime: { lte: new Date() },
        },
        orderBy: { startTime: 'desc' },
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              city: true,
            },
          },
        },
      });
    }
  
    /**
     * Fällige Prüfungen je Praxis:
     * - pro customerId nur das letzte Appointment
     * - dueDate = last.startTime + 12 Monate
     * - Wochenenden → nächster Werktag
     */
    async findDuePerCustomer() {
      const now = new Date();
  
      // Nur vergangene Termine berücksichtigen
      const pastAppointments = await this.prisma.appointment.findMany({
        where: {
          startTime: { lte: now },
        },
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              city: true,
            },
          },
        },
      });
  
      // Pro Praxis das letzte Appointment ermitteln
      const latestByCustomer = new Map<string, (typeof pastAppointments)[number]>();
  
      for (const a of pastAppointments) {
        const existing = latestByCustomer.get(a.customerId);
        if (!existing || a.startTime > existing.startTime) {
          latestByCustomer.set(a.customerId, a);
        }
      }
  
      // Fälligkeiten berechnen
      const result = Array.from(latestByCustomer.values())
        .map((a) => {
          const dueRaw = this.addMonths(a.startTime, 12);
          const dueAdjusted = this.adjustToNextWorkingDay(dueRaw);
  
          return {
            customerId: a.customerId,
            customer: a.customer,
            lastStartTime: a.startTime,
            dueDate: dueAdjusted,
            quarter: `Q${Math.floor(dueAdjusted.getMonth() / 3) + 1}/${dueAdjusted.getFullYear()}`,
          };
        })
        .filter((x) => x.dueDate > now)
        .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
  
      return result;
    }
  
}
