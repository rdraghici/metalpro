/**
 * SchemaMarkup Component
 *
 * Component for injecting JSON-LD structured data into the page
 * Used for Schema.org markup (Product, Breadcrumb, Organization, etc.)
 */

interface SchemaMarkupProps {
  schema: object | object[];
}

export function SchemaMarkup({ schema }: SchemaMarkupProps) {
  const schemaArray = Array.isArray(schema) ? schema : [schema];

  return (
    <>
      {schemaArray.map((schemaObj, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schemaObj),
          }}
        />
      ))}
    </>
  );
}
