export interface IApiRequest<T> {
	status: number;
	message: T;
}

export interface IApiPaginatedRequest<T> {
	data: T[];
	total: number;
}
