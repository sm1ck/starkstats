import mongoose from "mongoose";
import Contract from "./models/Contract";
class Database {
    url;
    filterOutdated = {
        $and: [
            {
                nonce: {
                    $ne: 0,
                },
            },
            {
                $and: [
                    {
                        nonce: {
                            $ne: 1,
                        },
                    },
                    {
                        balance: {
                            $ne: 0,
                        },
                    },
                ],
            },
        ],
    };
    constructor(url) {
        this.url = url;
        this.url = url;
        this.connect();
    }
    async connect() {
        await mongoose.connect(this.url);
    }
    async writeContracts(contracts) {
        await Contract.insertMany(contracts, { ordered: false })
            .catch((e) => {
            if (e?.stack?.includes("duplicate key")) {
                let successInsert = e?.result?.insertedCount;
                console.log(`[Insert] -> Данные уже есть в таблице, успешно сохранено ${successInsert} контрактов..`);
            }
            else {
                console.log("[Insert Error] -> ", e);
            }
        })
            .then(() => console.log(`[Insert] -> Сохранено ${contracts.length} контрактов..`));
    }
    async updateContract(doc) {
        await doc
            .save()
            .catch((e) => console.log(`[Error on save to db] -> `, e))
            .then(() => console.log(`[Update] -> Контракт: ${doc.contract}, всего транзакций: ${doc.nonce}, баланс: ${doc.balance} ETH, объем через мост: ${doc.bridgesVolume} ETH, объем через мост + биржи: ${doc.bridgesWithCexVolume} ETH, объем внутри сети: ${doc.internalVolume} ETH, объем внутри сети: ${doc.internalVolumeStables}$`));
    }
    async deleteContract(doc) {
        await doc
            .deleteOne()
            .catch((e) => console.log(`[Error on delete to db] -> `, e))
            .then(() => console.log(`[Update] -> Контракт ${doc.contract} удален..`));
    }
    async readContracts() {
        let contracts = await Contract.find();
        return contracts;
    }
    async readFilteredContracts(filter, limit, skip) {
        let contracts = limit !== undefined && skip !== undefined
            ? await Contract.find(filter).limit(limit).skip(skip)
            : await Contract.find(filter);
        return contracts;
    }
}
export default Database;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGF0YWJhc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZGF0YWJhc2UvRGF0YWJhc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxRQUF5QixNQUFNLFVBQVUsQ0FBQztBQUNqRCxPQUFPLFFBQXVCLE1BQU0sbUJBQW1CLENBQUM7QUFFeEQsTUFBTSxRQUFRO0lBeUJPO0lBeEJaLGNBQWMsR0FBRztRQUN0QixJQUFJLEVBQUU7WUFDSjtnQkFDRSxLQUFLLEVBQUU7b0JBQ0wsR0FBRyxFQUFFLENBQUM7aUJBQ1A7YUFDRjtZQUNEO2dCQUNFLElBQUksRUFBRTtvQkFDSjt3QkFDRSxLQUFLLEVBQUU7NEJBQ0wsR0FBRyxFQUFFLENBQUM7eUJBQ1A7cUJBQ0Y7b0JBQ0Q7d0JBQ0UsT0FBTyxFQUFFOzRCQUNQLEdBQUcsRUFBRSxDQUFDO3lCQUNQO3FCQUNGO2lCQUNGO2FBQ0Y7U0FDRjtLQUNGLENBQUM7SUFFRixZQUFtQixHQUFXO1FBQVgsUUFBRyxHQUFILEdBQUcsQ0FBUTtRQUM1QixJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztRQUNmLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUNqQixDQUFDO0lBRUQsS0FBSyxDQUFDLE9BQU87UUFDWCxNQUFNLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ25DLENBQUM7SUFFRCxLQUFLLENBQUMsY0FBYyxDQUNsQixTQUtVO1FBRVYsTUFBTSxRQUFRLENBQUMsVUFBVSxDQUFDLFNBQVMsRUFBRSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsQ0FBQzthQUNyRCxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtZQUNYLElBQUksQ0FBQyxFQUFFLEtBQUssRUFBRSxRQUFRLENBQUMsZUFBZSxDQUFDLEVBQUU7Z0JBQ3ZDLElBQUksYUFBYSxHQUFHLENBQUMsRUFBRSxNQUFNLEVBQUUsYUFBYSxDQUFDO2dCQUM3QyxPQUFPLENBQUMsR0FBRyxDQUNULDREQUE0RCxhQUFhLGVBQWUsQ0FDekYsQ0FBQzthQUNIO2lCQUFNO2dCQUNMLE9BQU8sQ0FBQyxHQUFHLENBQUMsb0JBQW9CLEVBQUUsQ0FBQyxDQUFDLENBQUM7YUFDdEM7UUFDSCxDQUFDLENBQUM7YUFDRCxJQUFJLENBQUMsR0FBRyxFQUFFLENBQ1QsT0FBTyxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsU0FBUyxDQUFDLE1BQU0sZUFBZSxDQUFDLENBQ3RFLENBQUM7SUFDTixDQUFDO0lBRUQsS0FBSyxDQUFDLGNBQWMsQ0FBQyxHQUF5QztRQUM1RCxNQUFNLEdBQUc7YUFDTixJQUFJLEVBQUU7YUFDTixLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsMkJBQTJCLEVBQUUsQ0FBQyxDQUFDLENBQUM7YUFDekQsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUNULE9BQU8sQ0FBQyxHQUFHLENBQ1QseUJBQXlCLEdBQUcsQ0FBQyxRQUFRLHVCQUF1QixHQUFHLENBQUMsS0FBSyxhQUFhLEdBQUcsQ0FBQyxPQUFPLDJCQUEyQixHQUFHLENBQUMsYUFBYSxtQ0FBbUMsR0FBRyxDQUFDLG9CQUFvQiw0QkFBNEIsR0FBRyxDQUFDLGNBQWMsNEJBQTRCLEdBQUcsQ0FBQyxxQkFBcUIsR0FBRyxDQUMzUyxDQUNGLENBQUM7SUFDTixDQUFDO0lBRUQsS0FBSyxDQUFDLGNBQWMsQ0FBQyxHQUF5QztRQUM1RCxNQUFNLEdBQUc7YUFDTixTQUFTLEVBQUU7YUFDWCxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsNkJBQTZCLEVBQUUsQ0FBQyxDQUFDLENBQUM7YUFDM0QsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsd0JBQXdCLEdBQUcsQ0FBQyxRQUFRLFdBQVcsQ0FBQyxDQUFDLENBQUM7SUFDOUUsQ0FBQztJQUVELEtBQUssQ0FBQyxhQUFhO1FBQ2pCLElBQUksU0FBUyxHQUFHLE1BQU0sUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3RDLE9BQU8sU0FBUyxDQUFDO0lBQ25CLENBQUM7SUFFRCxLQUFLLENBQUMscUJBQXFCLENBQ3pCLE1BQThCLEVBQzlCLEtBQWMsRUFDZCxJQUFhO1FBRWIsSUFBSSxTQUFTLEdBQ1gsS0FBSyxLQUFLLFNBQVMsSUFBSSxJQUFJLEtBQUssU0FBUztZQUN2QyxDQUFDLENBQUMsTUFBTSxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQ3JELENBQUMsQ0FBQyxNQUFNLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDbEMsT0FBTyxTQUFTLENBQUM7SUFDbkIsQ0FBQztDQUNGO0FBRUQsZUFBZSxRQUFRLENBQUMifQ==