interface Complaint {
    uid?: string,
    title: string,
    description: string,
    status: string,
    contract: Map<string, string>
    advertisement: Map<string, string>,
    worker: Map<string, string>,
    client: Map<string, string>
    created: Date,
    modified: Date,
    deleted: Date
}

export default Complaint;