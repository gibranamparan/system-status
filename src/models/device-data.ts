export enum Units {
  volts = 'volts',
  kelvin = 'kelvin',
  hPa = 'hPa',
  percentRH = 'percentRH',
  lux = 'lux',
  g = 'g',
  gauss = 'gauss',
  adc12bit = 'adc12bit',
}
export class SensorReading {
  units: Units
  value: number

  constructor(units: string, value: number) {
    this.units = units as Units
    this.value = value
  }

  get standarUnits(): string {
    return SensorReading.unitsToStandarUnits(this.units) || this.units
  }

  static unitsToStandarUnits(unit: Units) {
    const unitsMap = new Map()
    unitsMap.set(Units.volts, 'V')
    unitsMap.set(Units.kelvin, 'K')
    unitsMap.set(Units.hPa, 'hPa')
    unitsMap.set(Units.percentRH, '%RH')
    unitsMap.set(Units.lux, 'lux')
    unitsMap.set(Units.g, 'g')
    unitsMap.set(Units.gauss, 'G')
    unitsMap.set(Units.adc12bit, 'adc12bit')
    return unitsMap.get(unit)
  }
  toString() {
    return `${this.value} ${this.units}`
  }
}
export default class DeviceData {
  mac: string
  type: string
  latestTimestamp: Date
  sensorReadings: SensorReading[]
  buttonPressCounts: number[]
  lifetimeTxCount: number
  firmwareVersion: string
  hardwareVersion: string
  lastConnectorMac: string

  constructor(obj?: DeviceData) {
    this.mac = ''
    this.type = ''
    this.latestTimestamp = new Date()
    this.sensorReadings = []
    this.buttonPressCounts = []
    this.lifetimeTxCount = 0
    this.firmwareVersion = ''
    this.hardwareVersion = ''
    this.lastConnectorMac = ''

    if (!obj) return
    Object.assign(this, obj)
    this.sensorReadings = obj.sensorReadings.map((sr: SensorReading) => new SensorReading(sr.units, sr.value))
  }

  get voltage(): number {
    const sr = this.sensorReadings.find((sr) => sr.units === Units.volts)
    return sr?.value || 0
  }

  get otherReadings(): SensorReading[] {
    return this.sensorReadings.filter((sr) => sr.units !== Units.volts).sort((a, b) => a.units.localeCompare(b.units))
  }
}
