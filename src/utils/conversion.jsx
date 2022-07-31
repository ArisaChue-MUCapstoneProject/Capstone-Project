export const units = {
    // volume
    "milliliter": 1,
    "ml": 1, 
    "millilitre": 1, 
    "cc": 1, 
    "mL": 1,
    "tablespoon": 15,
    "tbsp": 15, 
    "tbs": 15, 
    "tbl": 15, 
    "T": 15,
    "teaspoon": 5,
    "tsp": 5,
    "t": 5,
    "pinch": 0.36,
    "pin": 0.36,
    "dash": 0.71,
    "d": 0.71,
    "fluidounce": 30, 
    "floz": 30,
    "gill": 118, 
    "cup": 237,
    "c": 237,
    "stick": 118,
    "pint": 473, 
    "p": 473, 
    "pt": 473, 
    "flpt": 473,
    "quart": 950,
    "q": 950,
    "qt": 950,
    "flqt": 950,
    "flqt": 950,
    "gallon": 3800,
    "gal": 3800,
    "liter": 1000,
    "litre": 1000,
    "l": 1000,
    "L": 1000,
    "deciliter": 100,
    "decilitre": 100,
    "dL": 100,
    "dl": 100,
    "peck": 8800,
    "pk": 8800,
    "barrel": 101606, 
    "bbl": 101606, 
    "bushel": 35239,
    "bu": 35239,
    // mass, weight
    "gram": 1,
    "gramme": 1,
    "g": 1,
    "pound": 454,
    "lb": 454, 
    "ounce": 28, 
    "oz": 28, 
    "milligram": 0.001,
    "milligramme": 0.001,
    "mg": 0.001,
    "kilogram": 1000,
    "kilogramme": 1000,
    "kg": 1000,
    "dozen": 12, 
    "doz": 12, 
    "bunch": 55, 
    "bch": 55, 
    "bn": 55,
    // non-measureable value
    "count": 1
}

export const basicUnits = ["choose unit", "mL", "tbsp", "tsp", "fl oz", "cup", "gallon", "L", "g", "lb", "oz", "kg", "count"]

const volumeUnits = new Set(["milliliter", "ml", "millilitre", "cc", "mL", "tablespoon", "tbsp", "tbs", "tbl", "T", "teaspoon", "tsp", "t", "pinch", "pin", "dash", "d", "fluidounce", "floz", "gill", "cup", "c", "stick", "pint", "p", "pt", "flpt", "quart", "q", "qt", "flqt", "gallon", "gal", "liter", "litre", "l", "L", "deciliter", "decilitre", "dL", "dl", "peck", "pk", "barrel", "bbl", "bushel", "bu"])
const weightUnits = new Set(["gram", "gramme", "g", "pound", "lb", "ounce", "oz", "milligram", "milligramme", "mg", "kilogram", "kilogramme", "kg", "dozen", "doz", "bunch", "bch", "bu", "bushel", "bn"])

export const basicCategories = ["choose category", "vegatables", "fruits", "meat", "dairy", "snacks", "grains", "frozen", "beverages", "condiments", "other"]
// unit enum 
export const UNIT_TYPE = Object.freeze({
    VOLUME: 1,
    WEIGHT: 0,
    UNKNOWN: -1
})

// merch enum 
export const MERCH_TYPE = Object.freeze({
    ONSALE: 1,
    INSTOCK: 0,
    WISHLIST: -1
})

// return 1 if volume unit, 0 if weight unit, -1 if non-measureable
export function isVolumeUnit(unit) {
    // clean string
    unit.trim()
    unit = unit.replace(/[^a-z]/gi, "")
    unit = unit.toLowerCase()

    if (volumeUnits.has(unit)) {
        return UNIT_TYPE.VOLUME
    }
    if (weightUnits.has(unit)) {
        return UNIT_TYPE.WEIGHT
    }
    return UNIT_TYPE.UNKNOWN
}

// return logic: [ unit type, amount in grams/mL/non-measureable unit ]
export function convertToStandard(unit, amount) {
    // clean string
    unit.trim()
    unit = unit.replace(/[^a-z]/gi, "")
    unit = unit.toLowerCase()
    // if unit is a plural, remove s
    if (unit.length > 1 && unit.slice(-1) == "s") {
        unit = unit.substring(0, unit.length - 1)
    }
    let curUnitType = isVolumeUnit(unit)
    return curUnitType >= UNIT_TYPE.WEIGHT ? [curUnitType, amount * units[unit]] : [curUnitType, amount]
}

export function updateStandardAmount(adjustAmountUnit, adjustAmount, curAmountUnit, curAmount) {
    if (!(adjustAmountUnit in units)) {
        // if both amounts are non-measureable units
        if (curAmountUnit == UNIT_TYPE.UNKNOWN) {
            return curAmount + adjustAmount
        }
        // units are not convertable
        return null
    }
    const conversion = convertToStandard(adjustAmountUnit, adjustAmount)
    return conversion[1] + curAmount
}

export function metricToCustomary(metricAmount, unitType) {
    if (unitType == UNIT_TYPE.VOLUME) {
        return Number(metricAmount / units["cup"]).toFixed(2)
    } else if (unitType == UNIT_TYPE.WEIGHT) {
        return Number(metricAmount / units["oz"]).toFixed(2)
    } 
    return metricAmount
}