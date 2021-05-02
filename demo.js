const { MongoClient } = require('mongodb');

async function main() {

    const uri = "mongodb+srv://adminuserdb001:NWQUq9qn7fuXNkXs@cluster0.aqwkk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

    const client = new MongoClient(uri);

    try {
        await client.connect();

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

