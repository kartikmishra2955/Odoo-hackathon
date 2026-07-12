const { z } = require("zod");

const assetSchema = z.object({
    assetName: z.string().min(3),
    categoryId: z.number(),
    description: z.string().optional(),
    serialNumber: z.string().optional(),
    vendor: z.string().optional(),
    location: z.string().optional(),
    purchaseCost: z.number().optional(),
    purchaseDate: z.string().optional(),
    warrantyExpiry: z.string().optional()
});

module.exports = assetSchema;