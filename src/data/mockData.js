export const mockWorkers = [
  {
    id: 1,
    name: "Carlos Méndez",
    role: "Mason",
    avatar: "CM",
    status: "activo",
    lat: 39.7580,
    lng: -104.9875,
    battery: 87,
    speed: 0,
    lastUpdate: new Date(),
    route: "Site North — 16th St Mall",
    phone: "+1 720 555-0001",
    checkIn: new Date(new Date().setHours(7, 52, 0, 0)),
    checkOut: null,
    messages: [
      { id: 1, from: "worker", text: "Arrived at the site, starting work.", time: "08:02" },
      { id: 2, from: "supervisor", text: "Perfect Carlos. Start with sector B.", time: "08:05" },
      { id: 3, from: "worker", text: "Understood, heading there.", time: "08:06" },
    ]
  },
  {
    id: 2,
    name: "Luis Fernández",
    role: "Electrician",
    avatar: "LF",
    status: "en-ruta",
    lat: 39.7510,
    lng: -105.0010,
    battery: 62,
    speed: 35,
    lastUpdate: new Date(),
    route: "Site Center — Colfax Ave",
    phone: "+1 720 555-0002",
    checkIn: new Date(new Date().setHours(8, 10, 0, 0)),
    checkOut: null,
    messages: [
      { id: 1, from: "supervisor", text: "Luis, how long until you arrive?", time: "09:10" },
      { id: 2, from: "worker", text: "About 10 minutes, there's traffic.", time: "09:11" },
    ]
  },
  {
    id: 3,
    name: "Miguel Torres",
    role: "Plumber",
    avatar: "MT",
    status: "activo",
    lat: 39.7620,
    lng: -104.9730,
    battery: 91,
    speed: 0,
    lastUpdate: new Date(),
    route: "Site South — Broadway & 6th",
    phone: "+1 720 555-0003",
    checkIn: new Date(new Date().setHours(7, 45, 0, 0)),
    checkOut: null,
    messages: [
      { id: 1, from: "worker", text: "There's a problem with the pipes on floor 3.", time: "10:15" },
      { id: 2, from: "supervisor", text: "Do you need extra materials?", time: "10:18" },
      { id: 3, from: "worker", text: "Yes, I need 2 meters of 3/4 pipe.", time: "10:19" },
      { id: 4, from: "supervisor", text: "I'll send it in an hour.", time: "10:21" },
    ]
  },
  {
    id: 4,
    name: "Roberto Silva",
    role: "Carpenter",
    avatar: "RS",
    status: "descanso",
    lat: 39.7440,
    lng: -104.9950,
    battery: 44,
    speed: 0,
    lastUpdate: new Date(),
    route: "Site East — Larimer St",
    phone: "+1 720 555-0004",
    checkIn: null,
    checkOut: null,
    messages: []
  },
  {
    id: 5,
    name: "Diego Ramírez",
    role: "Painter",
    avatar: "DR",
    status: "en-ruta",
    lat: 39.7680,
    lng: -105.0080,
    battery: 78,
    speed: 42,
    lastUpdate: new Date(),
    route: "Site West — Federal Blvd",
    phone: "+1 720 555-0005",
    checkIn: new Date(new Date().setHours(8, 5, 0, 0)),
    checkOut: null,
    messages: [
      { id: 1, from: "supervisor", text: "Diego, change the route. Take Colfax.", time: "11:05" },
      { id: 2, from: "worker", text: "Received, changing route.", time: "11:06" },
    ]
  },
]

export const statusConfig = {
  "activo":   { color: "#0DAB41", bg: "#E8F9EE", label: "On site",      dot: "#0DAB41" },
  "en-ruta":  { color: "#0369EA", bg: "#EBF3FF", label: "En route",     dot: "#0369EA" },
  "descanso": { color: "#F59E0B", bg: "#FEF3C7", label: "Break",        dot: "#F59E0B" },
  "inactivo": { color: "#6B7280", bg: "#F3F4F6", label: "Inactive",     dot: "#6B7280" },
  "sin-senal":{ color: "#9CA3AF", bg: "#F9FAFB", label: "No signal",    dot: "#9CA3AF" },
}

export const mockMachines = [
  { id: 'm1', name: 'Tower Crane',  operator: 'Carlos Méndez',  operatorId: 1, status: 'operating',      hoursUsed: 142, nextMaintenance: '2025-05-15', lat: 39.7575, lng: -104.9880, location: 'Site North' },
  { id: 'm2', name: 'Excavator',    operator: 'Luis Fernández', operatorId: 2, status: 'maintenance',    hoursUsed: 89,  nextMaintenance: '2025-04-25', lat: 39.7515, lng: -105.0005, location: 'Site Center' },
  { id: 'm3', name: 'Forklift',     operator: 'Miguel Torres',  operatorId: 3, status: 'available',      hoursUsed: 56,  nextMaintenance: '2025-06-01', lat: 39.7615, lng: -104.9735, location: 'Site South' },
  { id: 'm4', name: 'Compactor',    operator: 'Roberto Silva',  operatorId: 4, status: 'out-of-service', hoursUsed: 201, nextMaintenance: '2025-04-22', lat: 39.7445, lng: -104.9945, location: 'Site East' },
  { id: 'm5', name: 'Generator',    operator: 'Diego Ramírez',  operatorId: 5, status: 'operating',      hoursUsed: 334, nextMaintenance: '2025-07-10', lat: 39.7675, lng: -105.0075, location: 'Site West' },
]

export const machineStatusConfig = {
  'operating':      { label: 'Operating',       color: '#0DAB41', bg: '#E8F9EE' },
  'maintenance':    { label: 'In Maintenance',  color: '#F59E0B', bg: '#FEF3C7' },
  'out-of-service': { label: 'Out of Service',  color: '#DF2036', bg: '#FEE2E2' },
  'available':      { label: 'Available',       color: '#0369EA', bg: '#EBF3FF' },
}

export const mockZones = [
  { id: 'z1', label: 'Danger Zone A',   type: 'danger',  color: '#DF2036', fillColor: '#DF2036', center: [39.7555, -104.9910], radius: 120 },
  { id: 'z2', label: 'Work Zone North', type: 'work',    color: '#2563eb', fillColor: '#2563eb', center: [39.7600, -104.9850], radius: 100 },
  { id: 'z3', label: 'Safe Assembly',   type: 'safe',    color: '#0DAB41', fillColor: '#0DAB41', center: [39.7530, -104.9980], radius: 80 },
  { id: 'z4', label: 'Caution Area',    type: 'caution', color: '#F59E0B', fillColor: '#F59E0B', center: [39.7650, -104.9800], radius: 90 },
]

export const zoneTypeConfig = {
  danger:  { label: 'Danger',      color: '#DF2036' },
  caution: { label: 'Caution',     color: '#F59E0B' },
  safe:    { label: 'Safe Zone',   color: '#0DAB41' },
  work:    { label: 'Work Zone',   color: '#2563eb' },
}

export const mockGroups = [
  { id: 'g-all',     name: 'All Workers',    type: 'all',   members: [1,2,3,4,5] },
  { id: 'g-north',   name: 'Zone North',     type: 'zone',  members: [1, 2] },
  { id: 'g-south',   name: 'Zone South',     type: 'zone',  members: [3, 4, 5] },
  { id: 'g-morning', name: 'Morning Shift',  type: 'shift', members: [1, 3, 5] },
]

export const mockTasks = [
  { id: 't1', workerId: 1, title: 'Finish sector B foundation', priority: 'high',   dueDate: '2025-04-21', status: 'in-progress' },
  { id: 't2', workerId: 1, title: 'Inspect sector C walls',      priority: 'medium', dueDate: '2025-04-22', status: 'pending' },
  { id: 't3', workerId: 2, title: 'Wire floor 3 panels',         priority: 'high',   dueDate: '2025-04-21', status: 'pending' },
  { id: 't4', workerId: 3, title: 'Fix pipe leak floor 3',       priority: 'high',   dueDate: '2025-04-20', status: 'in-progress' },
  { id: 't5', workerId: 3, title: 'Replace valve B4',            priority: 'low',    dueDate: '2025-04-24', status: 'completed' },
  { id: 't6', workerId: 5, title: 'Paint south facade',          priority: 'medium', dueDate: '2025-04-23', status: 'pending' },
]
