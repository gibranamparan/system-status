export enum Units {
  volts = 'V',
  kelvin = 'K',
  hPa = 'hPa',
  percentRH = '%RH',
  lux = 'lux',
  g = 'g',
  gauss = 'G',
  adc12bit = 'adc12bit',
}
export class SensorsValues {
  voltage: number | null = null
  temperature: number | null = null
  humidity: number | null = null
  pressure: number | null = null
  luminosity: number | null = null
  updatedAt: string | null = null
}
export class SensorReading {
  constructor(public value: number, public units: Units) {}

  toString(decimals = 3) {
    return `${this.value.toFixed(decimals)} ${this.units}`
  }
}
export default class Sensors {
  constructor(
    obj?: SensorsValues | null,
    public voltage: SensorReading | null = null,
    public temperature: SensorReading | null = null,
    public humidity: SensorReading | null = null,
    public pressure: SensorReading | null = null,
    public luminosity: SensorReading | null = null,
    public updatedAt: Date | null = null,
  ) {
    if (!obj) return
    Object.assign(this, obj)
    this.voltage = obj.voltage === null || isNaN(obj.voltage) ? null : new SensorReading(obj.voltage, Units.volts)
    this.temperature =
      obj.temperature === null || isNaN(obj.temperature) ? null : new SensorReading(obj.temperature, Units.kelvin)
    this.humidity =
      obj.humidity === null || isNaN(obj.humidity) ? null : new SensorReading(obj.humidity, Units.percentRH)
    this.pressure = obj.pressure === null || isNaN(obj.pressure) ? null : new SensorReading(obj.pressure, Units.hPa)
    this.luminosity =
      obj.luminosity === null || isNaN(obj.luminosity) ? null : new SensorReading(obj.luminosity, Units.lux)
    this.updatedAt = obj.updatedAt ? new Date(obj.updatedAt) : null
  }

  get updatedAtString(): string {
    return this.updatedAt ? `${this.updatedAt?.toDateString()}, ${this.updatedAt?.toLocaleTimeString()}` : ''
  }
}
