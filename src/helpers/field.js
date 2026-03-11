const url = "http://localhost:4200/api/fields";

const getField = async () => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};
export { getField };
