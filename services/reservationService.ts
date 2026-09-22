
import { Reservation, DiningTable } from '../types';
import { GoogleGenAI } from "@google/genai";

export class ReservationService {
  private static reservations: Reservation[] = [];

  /**
   * Simulates a backend fetch for reservations
   */
  static async getReservations(): Promise<Reservation[]> {
    // In a real app, this would be an API call
    return this.reservations;
  }

  static setInitialData(initial: Reservation[]) {
    this.reservations = initial;
  }

  /**
   * "Backend" logic for seating a reservation
   */
  static async seatReservation(reservationId: string, tableId: string): Promise<boolean> {
    const res = this.reservations.find(r => r.id === reservationId);
    if (res) {
      res.status = 'Seated';
      res.tableId = tableId;
      return true;
    }
    return false;
  }

  /**
   * AI-Powered Seating Engine
   * Uses Gemini to analyze available tables and suggest the best fit
   */
  static async suggestTable(reservation: Reservation, tables: DiningTable[]): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const availableTables = tables.filter(t => t.status === 'Available' && t.isSeatable);
    const tableData = availableTables.map(t => ({ id: t.id, name: t.name, seats: t.seats }));

    const prompt = `
      You are a smart host for a busy restaurant. 
      Reservation: ${reservation.customerName}, Party of ${reservation.partySize}.
      Available Tables: ${JSON.stringify(tableData)}
      
      Suggest the best table ID from the list. 
      Rules:
      1. Table capacity must be >= party size.
      2. Prefer tables that closest match the party size (don't waste a 6-top on a 2-person party).
      3. Return ONLY the table ID string. No explanation.
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      return response.text?.trim() || "";
    } catch (error) {
      console.error("AI Seating Error:", error);
      // Fallback: simple logic
      const fit = availableTables.find(t => t.seats >= reservation.partySize);
      return fit?.id || "";
    }
  }
}
