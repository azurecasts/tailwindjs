# The TailwindJS Node Application We Use for AzureCasts

We're trying to build out a real application and this is it. It's an ecommerce storefront that will hopefully grow and morph as time goes on.

## Getting it to run

You'll need to set a few things up. They are:

 - A Stripe Account. You'll need a test key for this and you'll need to plug it into a `.env` file.
 - An Azure Storage Account. We use that in this store so you'll need one of those. 

This is a sample `.env` file - you can use this but obviously fill in your own values:

```
AZURE_STORAGE_CONNECTION_STRING="[GET THIS BY CREATING A STORAGE ACCOUNT]"
STRIPE_SECRET_KEY='[STRIPE SECRET KEY]'
```

## Creating an Azure Storage Account

There's a script in the `scripts` directory called `storage.sh`, which you can execute from your command line. You can do that by running `source scripts/storage.sh` from the root of the project directory.

You'll need to have the Azure CLI installed, be authenticated and have a default subscription set before this script will run properly.


## Questions? Thoughts?

This is a work in progress so there are probably LOADS of things we can do better. Leave an issue if you like, PRs are welcome too.
