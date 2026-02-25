import { Model, ObjectId } from "mongoose"; 

export class CRUDService<T> 
{ 
    private model: Model<T>; 

    constructor(model: Model<T>) 
    { 
        this.model = model; 
    } 
    
    async create(data: Parameters<Model<T>['create']>[0]) 
    { 
        return await this.model.create(data);
    } 
    
    async get(limitAmount: number, pageNumber?:number, filter?: Record<string, any>) 
    { 
        const skipAmount = limitAmount * (pageNumber || 0);
        return filter ? await this.model.find(filter).limit(limitAmount).skip(skipAmount) : await this.model.find({}).limit(limitAmount).skip(skipAmount) ; 
    } 
    
    async findOne(filter: Record<string, any>) 
    { 
        return await this.model.findOne(filter); 
    } 
    
    async findById(id: string, select?: Record<string, any>) 
    { 
        return select ? await this.model.findById(id).select(select) : await this.model.findById(id); 
    } 
    
    async updateById(id: string, data: Record<string, any>) 
    { 
        return await this.model.findByIdAndUpdate(id, data); 
    } 
    
    async deleteById(id: ObjectId)
    { 
        return await this.model.findByIdAndDelete(id); 
    }

    async countDocument(filter?: Record<string, any>)
    {
        return filter ? await this.model.countDocuments(filter) : await this.model.countDocuments();
    }
} 