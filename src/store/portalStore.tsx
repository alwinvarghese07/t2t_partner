import React, { createContext, useContext, useState } from 'react';

export interface Booking {
  id: string;
  customer: string;
  phone: string;
  service: string;
  serviceType: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  amount: number;
  paymentStatus: 'Paid' | 'Pending';
  status: 'Pending Confirmation' | 'Confirmed' | 'Checked In' | 'Completed' | 'Cancelled';
}

export interface InventoryItem {
  id: string;
  roomType: string;
  total: number;
  booked: number;
  available: number;
  price: number;
  status: 'Available' | 'Sold Out';
}

export interface PackageItem {
  code: string;
  name: string;
  service: string;
  roomType: string;
  maxGuests: number;
  duration: string;
  price: number;
  status: 'Active' | 'Draft';
}

export interface LedgerTransaction {
  id: string;
  date: string;
  refId: string;
  partner: string;
  description: string;
  debit: number;
  credit: number;
  balance: number;
  status: string;
}

export interface NotificationItem {
  id: number;
  title: string;
  desc: string;
  time: string;
  unread: boolean;
}

interface PortalState {
  bookings: Booking[];
  inventory: InventoryItem[];
  packages: PackageItem[];
  ledger: LedgerTransaction[];
  notifications: NotificationItem[];
  property: {
    name: string;
    adminName: string;
    role: string;
    location: string;
    phone: string;
  };
  addBooking: (booking: Omit<Booking, 'id' | 'paymentStatus' | 'status'>) => string;
  updateBookingStatus: (id: string, status: Booking['status']) => void;
  toggleInventory: (id: string) => void;
  addPackage: (pkg: PackageItem) => void;
  markAllNotificationsRead: () => void;
}

const initialBookings: Booking[] = [
  {
    id: 'BK-TIR-MVQN4Q9U-8160',
    customer: 'usha rani',
    phone: '+91 98765 43210',
    service: 'Annamaiah Guest House Tirupati - Standard Double Room',
    serviceType: 'Accommodation',
    checkIn: '27 Oct 2026, 05:30 PM',
    checkOut: '28 Oct 2026, 04:30 PM',
    guests: 2,
    amount: 2060,
    paymentStatus: 'Paid',
    status: 'Pending Confirmation'
  }
];

const initialInventory: InventoryItem[] = [
  { id: 'INV-1', roomType: 'Standard Double Room', total: 10, booked: 1, available: 9, price: 2060, status: 'Available' },
  { id: 'INV-2', roomType: 'Deluxe AC Room', total: 8, booked: 0, available: 8, price: 2950, status: 'Available' },
  { id: 'INV-3', roomType: 'Family Quad Suite', total: 4, booked: 0, available: 4, price: 4500, status: 'Available' }
];

const initialPackages: PackageItem[] = [
  {
    code: 'PKG-TIR-001',
    name: 'Tirumala Complete Pilgrimage & VIP Darshan',
    service: 'Annamaiah Guest House & Hills Transit',
    roomType: 'Deluxe Suite',
    maxGuests: 4,
    duration: '2 Days / 1 Night',
    price: 8499,
    status: 'Active'
  },
  {
    code: 'PKG-TIR-002',
    name: 'Kanipakam & Golden Temple Sightseeing Circuit',
    service: 'Chauffeur Driven AC Sedan + Stay',
    roomType: 'Standard Double Room',
    maxGuests: 2,
    duration: '1 Day',
    price: 4999,
    status: 'Active'
  },
  {
    code: 'PKG-TIR-003',
    name: 'Weekend Srivari Suprabhatham Package',
    service: 'Annamaiah Guest House Stay + Morning Darshan',
    roomType: 'Executive Room',
    maxGuests: 3,
    duration: '2 Days / 1 Night',
    price: 6200,
    status: 'Draft'
  }
];

const initialLedger: LedgerTransaction[] = [
  {
    id: 'TXN-9021',
    date: '27 Oct 2026, 05:35 PM',
    refId: 'BK-TIR-MVQN4Q9U-8160',
    partner: 'Annamaiah Guest House Tirupati',
    description: 'Booking Advance Payment - Standard Double Room',
    debit: 0,
    credit: 2060,
    balance: 2060,
    status: 'Cleared'
  }
];

const initialNotifications: NotificationItem[] = [
  { id: 1, title: 'New Booking Received', desc: 'Booking BK-TIR-MVQN4Q9U-8160 for usha rani is pending confirmation.', time: '20 mins ago', unread: true },
  { id: 2, title: 'Payment Confirmed', desc: '₹2,060 successfully credited via UPI for booking #8160.', time: '1 hour ago', unread: true },
  { id: 3, title: 'Inventory Alert', desc: 'Only 1 unit remains for Standard Double Room on 28 Oct.', time: '3 hours ago', unread: true },
  { id: 4, title: 'KYC Document Verified', desc: 'GST & Trade Certificate for Annamaiah Guest House approved.', time: '5 hours ago', unread: true },
  { id: 5, title: 'Brahmotsavam Rate Card Advisory', desc: 'Configure festive surge rates for upcoming pilgrimage dates.', time: '1 day ago', unread: true },
  { id: 6, title: 'Guest Review', desc: 'usha rani left a 5-star check-in feedback.', time: '1 day ago', unread: true },
  { id: 7, title: 'New Onboarding Request', desc: 'Sri Srinivasa Heritage Homestay applied for partner registration.', time: '2 days ago', unread: true },
  { id: 8, title: 'System Maintenance Notice', desc: 'Scheduled portal optimization completed successfully.', time: '2 days ago', unread: true },
  { id: 9, title: 'Weekly Settlement Ready', desc: 'Weekly auto-payout reconciliation batch generated.', time: '3 days ago', unread: true },
  { id: 10, title: 'Welcome to Partner Portal v2.0', desc: 'Single-pane operations view configured for Tirupati property.', time: '4 days ago', unread: true }
];

const PortalContext = createContext<PortalState | null>(null);

export const PortalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [packages, setPackages] = useState<PackageItem[]>(initialPackages);
  const [ledger, setLedger] = useState<LedgerTransaction[]>(initialLedger);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);

  const property = {
    name: 'Annamaiah Guest House Tirupati',
    adminName: 'Annamaiah Reddy',
    role: 'Partner Admin',
    location: 'Near RTC Central Bus Stand, Tirupati',
    phone: '+91 98765 43210'
  };

  const addBooking = (newB: Omit<Booking, 'id' | 'paymentStatus' | 'status'>) => {
    const id = 'BK-TIR-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    const createdBooking: Booking = {
      ...newB,
      id,
      paymentStatus: 'Paid',
      status: 'Pending Confirmation'
    };

    setBookings(prev => [createdBooking, ...prev]);

    // Update financial ledger
    const newTxn: LedgerTransaction = {
      id: 'TXN-' + Math.floor(1000 + Math.random() * 9000),
      date: 'Today, Just now',
      refId: id,
      partner: property.name,
      description: `Advance Tariff - ${newB.service}`,
      debit: 0,
      credit: newB.amount,
      balance: (ledger[0]?.balance || 0) + newB.amount,
      status: 'Cleared'
    };
    setLedger(prev => [newTxn, ...prev]);

    // Push notification
    setNotifications(prev => [
      {
        id: Date.now(),
        title: 'New Booking Created',
        desc: `Booking ${id} for ${newB.customer} has been registered.`,
        time: 'Just now',
        unread: true
      },
      ...prev
    ]);

    // Update inventory
    setInventory(prev => prev.map(item => {
      if (newB.service.includes(item.roomType) && item.available > 0) {
        return {
          ...item,
          booked: item.booked + 1,
          available: item.available - 1,
          status: item.available - 1 === 0 ? 'Sold Out' : 'Available'
        };
      }
      return item;
    }));

    return id;
  };

  const updateBookingStatus = (id: string, status: Booking['status']) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
  };

  const toggleInventory = (id: string) => {
    setInventory(prev => prev.map(item => {
      if (item.id === id) {
        const nextStatus = item.status === 'Available' ? 'Sold Out' : 'Available';
        return { ...item, status: nextStatus };
      }
      return item;
    }));
  };

  const addPackage = (pkg: PackageItem) => {
    setPackages(prev => [pkg, ...prev]);
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  return (
    <PortalContext.Provider value={{
      bookings,
      inventory,
      packages,
      ledger,
      notifications,
      property,
      addBooking,
      updateBookingStatus,
      toggleInventory,
      addPackage,
      markAllNotificationsRead
    }}>
      {children}
    </PortalContext.Provider>
  );
};

export const usePortal = () => {
  const context = useContext(PortalContext);
  if (!context) {
    throw new Error('usePortal must be used within a PortalProvider');
  }
  return context;
};
