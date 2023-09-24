const pluralRules = new Intl.PluralRules();

export const getPlural = (number: number, singular: string, plural: string) => {
  return pluralRules.select(number) === "one" ? singular : plural;
};
