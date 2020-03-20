import { EntityRepository, Repository } from "typeorm";
import { User } from "../entities/user.entity";
import { PasswordHashModel } from "../../_models/password-hash.model";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    /**
     * Creates a new user. Returns true if it was successfull and false if not.
     * @param email Email of the user to create
     * @param passwordHash PasswordHashModel of the user to create
     * @param admin Wether the created user is an admin
     */
    public async createAsync(email: string, passwordHash: PasswordHashModel): Promise<boolean> {
        try {
            let user = this.create();
            user.email = email;
            user.isAdmin = false;
            user.lastLogin = null;
            user.createdOn = new Date();

            user.password = passwordHash.hash;
            user.salt = passwordHash.salt;
            user.iterations = passwordHash.iterations;

            let insertResult = await this.save(user);

            return insertResult !== null;
        }
        catch (error) {
            return false;
        }
    }

    /**
     * Gets a user by its email and resolves the given relations.
     * @param email Email of the user to find
     * @param relations Relations to resolve
     */
    public async getByEmailAsync(email: string, relations: string[] = []): Promise<User> {
        let user = await this.findOne({
            where: [
                { email: email }
            ],
            relations: relations
        });

        return user;
    }

    /**
     * Returns if a user exists with a specific email.
     * @param email Email of the user to lookup
     */
    public async doesExistAsync(email: string): Promise<boolean> {
        return await this.getByEmailAsync(email) != null;
    }
}