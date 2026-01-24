export const JsonLd = () => {
    const schema = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "Modern Curtains and Blinds",
        "image": "https://static1.squarespace.com/static/6630e49af8475068fdc82abd/t/66d951f7b610cb5f68304239/1754989841467/",
        "address": "Melbourne\nAustrialia",
        "openingHours": "Mo 09:00-09:00, Tu 09:00-09:00, We 09:00-09:00, Th 09:00-09:00, Fr 09:00-09:00, Sa 09:00-04:00, Su 09:00-02:00",
        "url": "https://moderncurtainsandblinds.com.au/"
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
};
