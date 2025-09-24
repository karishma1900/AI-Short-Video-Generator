/**@type {import ("drizzle-kit").Config} */
export default {
    schema:"./configs/schema.js",
    dialect:'postgresql',
    dbCredentials:{
        url:'postgresql://neondb_owner:npg_o5MYNAa6KXIf@ep-bitter-bread-a1t59w0f-pooler.ap-southeast-1.aws.neon.tech/ai-short-video-generator?sslmode=require',
    }
}