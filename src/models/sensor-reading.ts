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
export default class SensorReading {
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
