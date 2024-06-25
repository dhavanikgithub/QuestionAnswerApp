import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'QA_LIST';

// Define the type for the objects
export interface QAObject {
    Id: number
    Question: string;
    Answer: string;
    SelectedOptionIndex?: number;
}

// Function to fetch the array of objects
export const fetchQAList = async (): Promise<QAObject[]> => {
    try {
        const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
        return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
        console.error('Failed to fetch the data from storage', e);
        return [];
    }
};
export const clearQAList = async (): Promise<void> => {
    try {
        await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (e) {
        console.error('Failed to clear the data from storage', e);
    }
}
export const fetchQAById = async (id: number): Promise<any> => {
    try {
        const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
        const data = JSON.parse(jsonValue!!)
        const obj:QAObject = data.filter((obj: QAObject) => obj.Id === id);
        return obj;
    } catch (e) {
        console.error('Failed to fetch the data from storage', e);
        return null;
    }
};

// Function to check if a QAObject exists by question
export const doesQAObjectExist = async (id: number): Promise<boolean> => {
    try {
        const qaList = await fetchQAList();
        return qaList.some(obj => obj.Id === id);
    } catch (e) {
        console.error('Failed to check if the object exists in storage', e);
        return false;
    }
};



// Function to add a new object to the array
export const addQAObject = async (newObject: QAObject): Promise<void> => {
    try {
        const qaList = await fetchQAList();
        const exists = qaList.some(obj => obj.Id === newObject.Id);

        if (!exists) {
            qaList.push(newObject);
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(qaList));
        } else {
            console.warn(`Object with Question "${newObject.Question}" already exists`);
        }
    } catch (e) {
        console.error('Failed to add the object to storage', e);
    }
};


// Function to update an object in the array by question
export const updateQAObject = async (id: number, updatedObject: QAObject): Promise<void> => {
    try {
        let qaList = await fetchQAList();
        qaList = qaList.map(obj => (obj.Id === id ? updatedObject : obj));
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(qaList));
    } catch (e) {
        console.error('Failed to update the object in storage', e);
    }
};

// Function to delete an object from the array by question
export const deleteQAObject = async (id: number): Promise<void> => {
    try {
        let qaList = await fetchQAList();
        qaList = qaList.filter(obj => obj.Id !== id);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(qaList));
    } catch (e) {
        console.error('Failed to delete the object from storage', e);
    }
};
