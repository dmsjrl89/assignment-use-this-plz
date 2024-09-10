export class DataModel {
    static data = []
    
    static setDataSource(data) {
        this.data = data
    }
    
    static insert(entry) {
        if (!this.data) {
            throw new Error("Data source not initialised.")
        }
        
        this.data.push(entry.clone())
    }
    
    static select(filter) {

        if (!this.data) {
            throw new Error("Data source not initialised.")
        }
        
        if (typeof filter == "function") {
            return this.data.filter(filter).map(e => e.clone())
        } else {
            return this.data.map(e => e.clone())
        }
    }
    
    static update(filter, entry) {
        if (!this.data) {
            throw new Error("Data source not initialised.")
        }
        
        if (typeof filter !== "function") {
            throw new Error("Filter must be a predicate function.")
        }
        
        let count = 0
        for (let index = 0; index < this.data.length; index++) {
            if (filter(this.data[index])) {
                this.data[index] = entry.clone()
                count++
            }
        }
        
        return count
    }
    
    static delete(filter) {
        if (!this.data) {
            throw new Error("Data source not initialised.")
        }
        
        if (typeof filter !== "function") {
            throw new Error("Filter must be a predicate function.")
        }
        
        const countBefore = this.data.length
        this.data = this.data.filter(entry => !filter(entry))
        return countBefore - this.data.length
    }
    
    clone() {
        return Object.assign(Object.create(Object.getPrototypeOf(this)), this)
    }
}
