export function deleteNullFieldsFromDTOIfTheyAreNotNullableInDB(
  DTO: { [key: string]: any },
  keys: string[],
) {
  keys.forEach((key) => {
    if ((DTO as any)[key] === null) {
      delete (DTO as any)[key];
    }
  });
}
