export class Utility {
  static INVALID_COMMENT_PATTERN = '[\\s\\S]*[=;|\n\r]+[\\s\\S]*'

  static getFileLongName(fileShortName: string): string {
    const timeStamp: Number = Math.floor(Date.now())
    const fileLongName = fileShortName.substring(0, fileShortName.lastIndexOf('.')).concat(timeStamp.toString().concat('_')).concat(fileShortName.substring(fileShortName.lastIndexOf('.'), fileShortName.length))
    return fileLongName
  }

  static cloneObj(obj: object): any {
    // It is shallow copy.
    return Object.assign(Object.create(obj), obj)
  }
  static generateCorrelationId(): string {
    // 'REPORTING-C-' + YYYYMMDD_HHMMSSSSS
    const now = new Date()
    return 'REPORTING-C-' + now.toISOString().replace(/[-:Z.]/g, '').replace(/T/g, '_')
  }

  static stringParse(str: string, strArray: string[]): string {
    return str.replace(/{(\d+)}/g, (match, num) => {
      return typeof strArray[num] !== 'undefined' ? strArray[num] : match
    })
  }
  static stringMapParse(strMap: Map<string, string>, strArray: string[]): string {
    // default stringParse for jsonRequest
    const result: Map<string, string> = new Map()
    strMap.forEach((v: string, k: string) => {
      const record: string = this.stringParse(v, strArray)
      if (record.search(/{(\d+)}/g) < 0) result.set(k, record)  // skip undefined values, this is intend for hierarchy
    })
    return this.strMapToJson(result)
  }
  static extractString(str: string, delimeter: string): Map<string, string> {
    // metadata: "batchIds=REPORTING-C-20171016_181241839"
    const result: Map<string, string> = new Map<string, string>()
    const splited: string[] = str.split(delimeter)
    result.set(splited[0], splited[1])
    return result
  }

  static getFileName(path: string, seperate: string): string {
    const factors: string[] = path.split(seperate)
    const length: number = factors.length
    if (length > 0) {
      return factors[length - 1]
    }
    return ''
  }
  static strMapToObj(strMap: Map<string, string>): object {
    const obj = Object.create(null)
    strMap.forEach((v: string, k: string) => {
      obj[k] = v
    })
    return obj
  }
  static strMapToJson(strMap: Map<string, string>): string {
    return JSON.stringify(this.strMapToObj(strMap))
  }
  static objToStrMap(obj: object): Map<string, string> {
    const strMap = new Map()
    for (const k of Object.keys(obj)) {
      strMap.set(k, obj[k])
    }
    return strMap
  }
}

// console.log(Utility.getFileLongName('fileshortname.xlsx'))

