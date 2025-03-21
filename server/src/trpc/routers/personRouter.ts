import { and, desc, eq, inArray, sql } from 'drizzle-orm';
import { z } from 'zod';

import { db } from '@server/db';
import {
	contestTable,
	contestYearTable,
	personWorkTable,
	problemTable,
	seriesTable,
	workStateEnum,
	workTable,
} from '@server/db/schema';
import { trpc } from '@server/trpc/trpc';

import { authedProcedure } from '../middleware';

export const personRouter = trpc.router({
	work: authedProcedure
		.input(z.enum(workStateEnum.enumValues).nullish())
		.query(async ({ ctx, input }) => {
			return await db
				.select()
				.from(workTable)
				.innerJoin(
					personWorkTable,
					eq(personWorkTable.workId, workTable.workId)
				)
				.innerJoin(
					problemTable,
					eq(workTable.problemId, problemTable.problemId)
				)
				.leftJoin(
					seriesTable,
					eq(seriesTable.seriesId, problemTable.seriesId)
				)
				.leftJoin(
					contestYearTable,
					eq(
						contestYearTable.contestYearId,
						seriesTable.contestYearId
					)
				)
				.leftJoin(
					contestTable,
					eq(
						contestTable.contestId,
						sql`COALESCE(${contestYearTable.contestId}, ${problemTable.contestId})`
					)
				)
				.where(
					and(
						eq(personWorkTable.personId, ctx.person.personId),
						input ? eq(workTable.state, input) : undefined
					)
				);
		}),
	/**
	 * Return list of contest years, that are active and person is
	 * organizing them.
	 */
	activeContestYears: authedProcedure.query(async ({ ctx }) => {
		// TODO create logic for active contest year
		// TODO filter by since and until
		const contestIds = ctx.person.organizers.map(
			(organizer) => organizer.contestId
		);

		return await db
			.selectDistinctOn([contestYearTable.contestId])
			.from(contestYearTable)
			.innerJoin(
				contestTable,
				eq(contestTable.contestId, contestYearTable.contestId)
			)
			.where(inArray(contestYearTable.contestId, contestIds))
			.orderBy(contestYearTable.contestId, desc(contestYearTable.year));
	}),
	roles: authedProcedure.query(({ ctx }) => {
		// Map and Set cannot be serialized and must converted to arrays and objects
		const contestRolesMap = new Map<string, string[]>();

		for (const [key, value] of ctx.aclRoles.contestRole.entries()) {
			contestRolesMap.set(key, [...value.values()]);
		}

		// serialize
		return {
			baseRole: [...ctx.aclRoles.baseRole.values()],
			contestRole: Object.fromEntries(contestRolesMap),
		};
	}),
});
