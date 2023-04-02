interface Util {
    /**
     * 对象删除指定的字段,返回新的对象
     * @param {Object} data  操作对象
     * @param {Array<String>} deleteKeys 需要删除的键名(数组形式)
     */
    deleteObjectKeys: <T extends Record<string, any>>(data: T, deleteKeys?: Array<keyof T>) => Partial<T>;
}

const util: Util = {
    /**
     * 对象删除指定的字段,返回新的对象
     * @param {Object} data  操作对象
     * @param {Array<String>} deleteKeys 需要删除的键名(数组形式)
     */
    deleteObjectKeys: <T extends Record<string, any>>(data: T, deleteKeys: Array<keyof T> = []) => {
        const newData = {} as Partial<T>;
        if (data) {
            for (const key in data) {
                if (deleteKeys.indexOf(key as keyof T) === -1) {
                    newData[key] = data[key];
                }
            }
        }
        return newData;
    }
};

export default util;