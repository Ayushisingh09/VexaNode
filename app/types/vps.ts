export interface VPSPlan {
  id: string
  name: string
  badge?: string
  image: string
  cpu: string
  cpuDetail: string
  ram: string
  ramDetail: string
  storage: string
  storageDetail: string
  bandwidth?: string
  bandwidthDetail?: string
  price: string
  period: string
  orderLink: string
}

export interface VPSPlanType {
  id: string
  name: string
  displayName: string
  image: string
}

export interface VPSLocation {
  id: string
  name: string
  flag: string
  displayName: string
  availableCpus: string[]
}



export interface VPSConfig {
  planTypes: VPSPlanType[]
  locations: VPSLocation[]
  plans: {
    [key: string]: VPSPlan[]
  }
}
