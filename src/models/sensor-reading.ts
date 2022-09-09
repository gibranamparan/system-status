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
  constructor(public units: Units, public value: number) {}

  get standardUnits(): string {
    return SensorReading.unitsToStandardUnits(this.units) || this.units
  }

  static unitsToStandardUnits(unit: Units): string {
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
