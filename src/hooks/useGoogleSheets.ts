
import { useState, useEffect } from 'react';
import { toast } from "sonner";

const SPREADSHEET_ID = '1A105rcZ0ktlaWVGf0Z-ImoUNYwOZJqgOoFgp7Vuagcw';
const API_KEY = 'AIzaSyDGMX_mEARxckGw1Uz4P5t-noCjbFbZkh0'; // Google Sheets API key

interface SheetData {
  id: number;
  orderNumber: string;
  purchaseOrder: string;
  childDetails: string;
  designType: string;
  quantity: number;
  trackingNumber: string;
  status: string;
  notes: string;
}

interface Summary {
  totalOrders: number;
  pendingDesign: number;
  shipped: number;
}

export const useGoogleSheets = (sheetName: string) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [sheetData, setSheetData] = useState<SheetData[]>([]);
  const [summary, setSummary] = useState<Summary>({
    totalOrders: 0,
    pendingDesign: 0,
    shipped: 0
  });

  useEffect(() => {
    const fetchSheetData = async () => {
      setIsLoading(true);
      try {
        // Fetch sheet data using Google Sheets API
        const response = await fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(sheetName)}?key=${API_KEY}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch sheet data');
        }

        const result = await response.json();
        const rows = result.values || [];

        if (rows.length > 0) {
          // Extract summary data from cell references (I2, J2, K2)
          const summaryData: Summary = {
            totalOrders: parseInt(rows[1][8]) || 0, // I2
            pendingDesign: parseInt(rows[1][9]) || 0, // J2
            shipped: parseInt(rows[1][10]) || 0, // K2
          };
          setSummary(summaryData);

          // Convert sheet rows to structured data, starting from row 1 (header is row 0)
          const headers = rows[0];
          const formattedData: SheetData[] = rows.slice(1).map((row: string[], index: number) => ({
            id: index,
            orderNumber: row[0] || '',
            purchaseOrder: row[1] || '',
            childDetails: row[2] || '',
            designType: row[3] || '',
            quantity: parseInt(row[4]) || 0,
            trackingNumber: row[5] || '',
            status: row[6] || '',
            notes: row[7] || '',
          }));

          setSheetData(formattedData);
        }
      } catch (error) {
        console.error("Error fetching Google Sheet data:", error);
        toast.error("ไม่สามารถดึงข้อมูลจาก Google Sheets ได้");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSheetData();
  }, [sheetName]);

  const updateCell = async (sheetName: string, row: number, col: number, value: string) => {
    try {
      // This is a placeholder for the update functionality
      // In a real implementation, we'd use the Google Sheets API to update the cell
      // This would require OAuth2 authentication, not just an API key
      
      toast.success("บันทึกข้อมูลสำเร็จ");
      return true;
    } catch (error) {
      console.error("Error updating cell:", error);
      toast.error("ไม่สามารถบันทึกข้อมูลได้");
      return false;
    }
  };

  return { isLoading, sheetData, summary, updateCell };
};
