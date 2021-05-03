const { MongoClient } = require('mongodb');

async function main() {

    const uri = "mongodb+srv://adminuserdb001:NWQUq9qn7fuXNkXs@cluster0.aqwkk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

    const client = new MongoClient(uri);

    try {
        await client.connect();

        await fiendOneListingsWithMinimumBedroomsBathroomsAndMostRecentReviews(client, {
          minimumNumbersOfBedrooms: 4,
          minimumNumbersOfBathrooms: 2,
          maximumNumbersOfResults: 5
        });

        await fiendOneListingByName(client, "Infinite Views");

        await createMultipleListings(client, [
            {
                name: "Infinite Views",
                summary: "Modern home with infinte views from infinity pool",
                property_type: "House",
                bedrooms: 5,
                bathrooms: 4.5,
                beds: 5
            },
            {
                name: "Private room in London",
                property_type: "Apartment",
                bedrooms: 1,
                bathrooms: 1,
                beds: 2
            },
        ]);

        await createListing(client, {
            name: "Lovely Loft",
            summary: "A charming loft in Paris",
            bedrooms: 1,
            bathrooms: 1
        });
    }
    catch (e) {
        console.error(e);
    }
    finally {
        await client.close();
    }
}

main().catch(console.error);

async function fiendOneListingsWithMinimumBedroomsBathroomsAndMostRecentReviews(client, {
  minimumNumbersOfBedrooms = 0,
  minimumNumbersOfBathrooms = 0,
  maximumNumbersOfResults = Number.MAX_SAFE_INTEGER
} = {}) {
  const cursor = client.db("sample_airbnb").collection("listingsAndReviews").find({
    bedrooms: { $gte: minimumNumbersOfBedrooms},
    bathrooms: { $gte: minimumNumbersOfBathrooms}
  }).sort({ last_review: -1}).limit(maximumNumbersOfResults);

 const results = await cursor.toArray();

 if (results.length > 0) {
 console.log(`Found listing(s) with at least ${minimumNumbersOfBedrooms}
bedrooms and ${minimumNumbersOfBathrooms} bathrooms:`);
results.forEach((result, i) => {
  date = new Date(result.last_review).toDateString();
  console.log();
  console.log(`${i + 1}. name: ${result.name}`);
  console.log(`   _id: ${result._id}`);
  console.log(`   bedrooms: ${result.bedrooms}`);
  console.log(`   bathrooms: ${result.bathrooms}`);
  console.log(`   most recent review date: ${new Date(result.last_review)
  .toDateString()}`);
});
} else {
  console.log(`No listings found with at least ${minimumNumbersOfBedrooms} bedrooms and ${minimumNumbersOfBathrooms} bathrooms`);
}
);
 }
}

async function fiendOneListingByName(client, nameOfListing) {

 const result = await client.db("sample_airbnb").collection("listingsAndReviews").findOne({name: nameOfListing});

 if (result) {
   console.log(`Found a listing in the collection with the name '${nameOfListing}'`);
   console.log(result);
 }
 else {
   console.log(`No listings found with the name '${nameOfListing}'`);
 }
}

async function createMultipleListings(client, newListings) {

    const result = await client.db("sample_airbnb").collection("listingsAndReviews").insertMany(newListings)
    console.log(`${result.insertedCount} new listings created with the following id(s):`);
    console.log(result.insertedIds);
}

async function createListing(client, newListing) {

   const result = await client.db("sample_airbnb").collection("listingsAndReviews").insertOne(newListing);
   console.log(`New listing created with the following id: ${result.insertedId}`);
}

async function listDatabases(client) {

   const databaseList = await client.db().admin().listDatabases();
   console.log("Databases: ");
   databaseList.databases.forEach(db => {
       console.log(`- ${db.name}`);
   });
}
