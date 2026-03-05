import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { StartupNode, UserProfile } from "../backend.d";
import { useActor } from "./useActor";

// ─── Query hooks ────────────────────────────────────────────────────────────

export function useAllNodes() {
  const { actor, isFetching } = useActor();
  return useQuery<StartupNode[]>({
    queryKey: ["nodes", "all"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllNodes();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useMyNode() {
  const { actor, isFetching } = useActor();
  return useQuery<StartupNode | null>({
    queryKey: ["nodes", "mine"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMyNode();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useMyProfile() {
  const { actor, isFetching } = useActor();
  return useQuery<UserProfile | null>({
    queryKey: ["profile", "mine"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMyProfile();
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });
}

// ─── Mutation hooks ──────────────────────────────────────────────────────────

export function useCreateNode() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      companyName: string;
      description: string;
      sector: string;
      city: string;
      latitude: number;
      longitude: number;
      directive: string;
    }) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.createNode(
        data.companyName,
        data.description,
        data.sector,
        data.city,
        data.latitude,
        data.longitude,
        data.directive,
      );
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["nodes"] });
    },
  });
}

export function useUpdateNode() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: string;
      companyName: string;
      description: string;
      sector: string;
      city: string;
      latitude: number;
      longitude: number;
      directive: string;
    }) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.updateNode(
        data.id,
        data.companyName,
        data.description,
        data.sector,
        data.city,
        data.latitude,
        data.longitude,
        data.directive,
      );
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["nodes"] });
    },
  });
}

export function useDeleteNode() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.deleteNode(id);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["nodes"] });
    },
  });
}

export function useUpsertProfile() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      email: string;
      phone: string;
      city: string;
      sector: string;
      startupName: string;
      bio: string;
    }) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.upsertProfile(
        data.name,
        data.email,
        data.phone,
        data.city,
        data.sector,
        data.startupName,
        data.bio,
      );
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}

export function useSeedData() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not authenticated");
      return actor.seedData();
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["nodes"] });
    },
  });
}
