STORAGE_NAME=tailwind$RANDOM

#Create the resource group
az group create --name tailwind --location westus2

# az storage account create --name
#                           --resource-group
#                           [--access-tier {Cool, Hot}]
#                           [--assign-identity]
#                           [--bypass {AzureServices, Logging, Metrics, None}]
#                           [--custom-domain]
#                           [--default-action {Allow, Deny}]
#                           [--encryption-services {blob, file, queue, table}]
#                           [--https-only {false, true}]
#                           [--kind {BlobStorage, BlockBlobStorage, FileStorage, Storage, StorageV2}]
#                           [--location]
#                           [--sku {Premium_LRS, Premium_ZRS, Standard_GRS, Standard_LRS, Standard_RAGRS, Standard_ZRS}]
#                           [--subscription]
#                           [--tags]

#we need a storage account that we can use so create here and get the returned access key
az storage account create -g tailwind -n $STORAGE_NAME --sku Standard_RAGRS
echo "Pop the response into your .env file, which should be AZURE_STORAGE_CONNECTION_STRING=[PUT CONNECTION STRING HERE]"
az storage account show-connection-string -n $STORAGE_NAME
