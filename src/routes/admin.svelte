<script context="module">
	/**
	 * Fetches prior to page rendering.
	 */
	export const load = async ({ fetch }) => {
		// Check if there is a user logged in.
		const authResponse = await fetch('/api/auth');

		if (authResponse.ok) {
			// Get all transaction types
			const transactionTypes = await getTransactionTypes(fetch);

			return {
				status: transactionTypes.status,
				props: {
					data: {
						incomeTypes: transactionTypes.data.incomeTypes,
						expenseTypes: transactionTypes.data.expenseTypes
					}
				},
				error: transactionTypes.error
			};
		} else {
			return {
				status: 302,
				redirect: '/login'
			};
		}
	};

	/**
	 * Sends an api call to get all the transaction types.
	 * @param {Function} customFetch Fetch api to use.
	 * @returns {Object} Response object.
	 */
	export const getTransactionTypes = async (customFetch) => {
		const response = await customFetch('/api/types');
		const { incomeTypes, expenseTypes, errorMessage } = await response.json();

		return {
			status: response.status,
			data: {
				incomeTypes,
				expenseTypes
			},
			error: errorMessage
		};
	};
</script>

<script>
	import { onMount } from 'svelte';
	import user from '$lib/stores/user';
	import { PAGE_TITLE } from '$lib/config/constants';
	import Notification from '$lib/components/Notification.svelte';
	import Card from '$lib/components/Card.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import ArrowLeft from '$lib/assets/ArrowLeft.svelte';
	import Delete from '$lib/assets/Delete.svelte';
	import Edit from '$lib/assets/Edit.svelte';
	import Loading from '$lib/assets/Loading.svelte';
	import Select from '$lib/components/Select.svelte';

	onMount(() => user.useLocalStorage());

	/* Properties */
	export let data = {};
	let isDeleteModalOpen = false;
	let isEditModalOpen = false;
	let isSubmitting = false;
	let toDelete = {
		id: 0,
		type: ''
	};
	let submissionError = '';
	let newTransactionType = {
		type: '',
		value: '',
		name: ''
	};
	let editTransactionData = {
		id: 0,
		type: '',
		name: '',
		value: ''
	};
	const transactionTypes = [
		{
			name: 'Income',
			value: 'income'
		},
		{
			name: 'Expense',
			value: 'expense'
		}
	];
	$: isAdmin = $user.email === 'admin@admin.com';

	/**
	 * Refreshes the transaction types
	 * @returns {Object} Transaction types
	 */
	const refreshTransactionTypes = async () => {
		const response = await getTransactionTypes(fetch);

		return response.data;
	};

	/**
	 * Triggers a data refresh
	 */
	const handleRefreshTransactionTypes = () => {
		data = refreshTransactionTypes();
	};

	/**
	 * Sends an api call to add a new transaction type
	 */
	const addNewTransactionType = async () => {
		isSubmitting = true;
		submissionError = '';

		const response = await fetch('/api/types', {
			method: 'POST',
			headers: new Headers({ 'content-type': 'application/json' }),
			body: JSON.stringify({
				...newTransactionType
			})
		});

		if (response.ok) {
			isSubmitting = false;
			newTransactionType = {
				type: '',
				value: '',
				name: ''
			};

			handleRefreshTransactionTypes();
		} else {
			const { errorMessage } = await response.json();

			isSubmitting = false;
			submissionError = errorMessage;
		}
	};

	/**
	 * Sends an api call to delete a transaction type.
	 * @param {string} type  Type of transaction type to be deleted.
	 * @param {string} id  ID of transaction type to be deleted.
	 */
	const deleteTransactionType = async (type, id) => {
		const delResponse = await fetch('/api/types', {
			method: 'DELETE',
			headers: new Headers({ 'content-type': 'application/json' }),
			body: JSON.stringify({
				type,
				id
			})
		});

		if (delResponse.ok) {
			handleRefreshTransactionTypes();

			toDelete = {
				id: 0,
				type: ''
			};
		}
	};

	/**
	 * Sends an api call to edit a transaction type
	 * @param {Object} data Data of transaction to be updated
	 */
	const editTransactionType = async (data) => {
		isSubmitting = true;
		submissionError = '';
		const { id, type, name, value } = data;
		const editResponse = await fetch('/api/types', {
			method: 'PUT',
			headers: new Headers({ 'content-type': 'application/json' }),
			body: JSON.stringify({
				id,
				type,
				name,
				value
			})
		});

		if (editResponse.ok) {
			newTransactionType = {
				type: '',
				value: '',
				name: ''
			};
			isEditModalOpen = false;
			isSubmitting = false;

			handleRefreshTransactionTypes();
		} else {
			const { errorMessage } = await editResponse.json();

			isSubmitting = false;
			submissionError = errorMessage;
		}
	};

	/**
	 * Opens the confirm delete modal
	 * @param type Type of transaction
	 * @param id Transaction ID
	 */
	const handleDeleteTriggered = (type, id) => {
		toDelete = {
			type,
			id
		};
		isDeleteModalOpen = true;
	};

	/**
	 * Opens the edit type modal
	 * @param type Type of transaction
	 * @param id Transaction ID
	 */
	const handleEditTriggered = (type, data) => {
		editTransactionData = {
			type,
			id: data.id,
			value: data.value,
			name: data.name
		};
		isEditModalOpen = true;
	};

	/**
	 * Confirms the delete request
	 */
	const confirmDelete = () => {
		const { type, id } = toDelete;

		deleteTransactionType(type, id);

		isDeleteModalOpen = false;
	};

	/**
	 * Confirms the delete request
	 */
	const confirmEdit = () => {
		editTransactionType(editTransactionData);
	};

	/**
	 * Cancel the delete request
	 */
	const cancelDelete = () => {
		toDelete = {
			id: 0,
			type: ''
		};
		isDeleteModalOpen = false;
	};

	/**
	 * Cancel the edit request
	 */
	const cancelEdit = () => {
		newTransactionType = {
			type: '',
			value: '',
			name: ''
		};
		isEditModalOpen = false;
	};

	/**
	 * Discards the changes on the new transaction type form.
	 */
	const discardChanges = () => {
		newTransactionType = {
			type: '',
			value: '',
			name: ''
		};
		submissionError = '';
	};
</script>

<svelte:head>
	<title>{PAGE_TITLE} | Admin</title>
</svelte:head>

<section>
	<a sveltekit:prefetch class="flex items-center" href="/">
		<ArrowLeft customClass="mr-1 inline" /> Back
	</a>
	<h1 class="text-2xl border-b-2 pb-2 mb-6">Admin Management</h1>

	{#if isAdmin}
		<!-- Add new transaction type -->
		<h1 class="mb-2">Add a new transaction type</h1>
		{#if submissionError}
			<div class="w-fit">
				<Notification type="error">
					{submissionError}
				</Notification>
			</div>
		{/if}
		<form
			on:submit|preventDefault={addNewTransactionType}
			class="mb-6 grid gap-2 grid-cols-1 md:grid-cols-3"
		>
			<div>
				<Select
					label="Type"
					name="type"
					required
					options={transactionTypes}
					bind:value={newTransactionType.type}
					disabled={isSubmitting}
				/>
			</div>
			<div>
				<p class="text-base text-gray-400">Name</p>
				<input
					type="text"
					name="name"
					disabled={isSubmitting}
					required
					bind:value={newTransactionType.name}
				/>
			</div>
			<div>
				<p class="text-base text-gray-400">Code</p>
				<input
					type="text"
					name="code"
					disabled={isSubmitting}
					required
					bind:value={newTransactionType.value}
				/>
			</div>
			<div class="text-right md:col-span-3">
				<button
					type="button"
					class="btn-secondary btn-outline"
					disabled={isSubmitting}
					on:click={discardChanges}>Discard</button
				>
				<button type="submit" class="btn-primary" disabled={isSubmitting}>Submit</button>
			</div>
		</form>

		{#await data}
			<div class="py-6 flex items-center">
				<span>Refreshing entries...</span>
				<Loading customClass="animate-spin ml-2" />
			</div>
		{:then data}
			<!-- Income Types -->
			<Card>
				<div class="text-2xl font-black" slot="card-header">Income Types</div>
				<div class="overflow-auto" slot="card-body">
					<table class="border border-gray-500 w-full text-sm md:text-2xl">
						<thead>
							<tr class="bg-gray-900">
								<th class="p-2 font-black border border-gray-500">Name</th>
								<th class="p-2 font-black border border-gray-500">Code</th>
								<th class="p-2 font-black border border-gray-500">Actions</th>
							</tr>
						</thead>
						<tbody>
							{#if data.incomeTypes.length}
								{#each data.incomeTypes as type}
									<tr>
										<td class="px-4 py-1 border border-gray-500">
											{type.name}
										</td>
										<td class="px-4 py-1 border border-gray-500">
											{type.value}
										</td>
										<td class="px-4 py-1 border border-gray-500 text-center">
											<button
												class="btn-outline text-base"
												on:click={handleEditTriggered('income', type)}
											>
												<Edit />
											</button>
											<button
												class="btn-outline text-base"
												on:click={handleDeleteTriggered('income', type.id)}
											>
												<Delete />
											</button>
										</td>
									</tr>
								{/each}
							{:else}
								<tr><td align="center" colspan="3">No data...</td></tr>
							{/if}
						</tbody>
					</table>
				</div>
			</Card>

			<div class="mb-6" />

			<!-- Expense Types -->
			<Card>
				<div class="text-2xl font-black" slot="card-header">Expense Types</div>
				<div class="overflow-auto" slot="card-body">
					<table class="border border-gray-500 w-full text-sm md:text-2xl">
						<thead>
							<tr class="bg-gray-900">
								<th class="p-2 font-black border border-gray-500">Name</th>
								<th class="p-2 font-black border border-gray-500">Code</th>
								<th class="p-2 font-black border border-gray-500">Actions</th>
							</tr>
						</thead>
						<tbody>
							{#if data.expenseTypes.length}
								{#each data.expenseTypes as type}
									<tr>
										<td class="px-4 py-1 border border-gray-500">
											{type.name}
										</td>
										<td class="px-4 py-1 border border-gray-500">
											{type.value}
										</td>
										<td class="px-4 py-1 border border-gray-500 text-center">
											<button
												class="btn-outline text-base"
												on:click={handleEditTriggered('expense', type)}
											>
												<Edit />
											</button>
											<button
												class="btn-outline text-base"
												on:click={handleDeleteTriggered('expense', type.id)}
											>
												<Delete />
											</button>
										</td>
									</tr>
								{/each}
							{:else}
								<tr><td align="center" colspan="3">No data...</td></tr>
							{/if}
						</tbody>
					</table>
				</div>
			</Card>
		{/await}
	{:else}
		<div class="grid place-content-center">
			<div class="max-w-fit">
				<Notification type="error">
					You need admin privileges to access this page.
				</Notification>
			</div>
		</div>
	{/if}
</section>

<!-- Delete confirmation modal -->
<Modal bind:isOpen={isDeleteModalOpen} on:close={cancelDelete}>
	<section slot="modal-header">Delete Type</section>
	<section slot="modal-body">
		<div class="w-full">
			<p>Do you really want to delete this type?</p>
			<p class="text-base">Note: This action cannot be undone.</p>
			<div class="text-right pt-6">
				<button class="btn-secondary btn-outline mr-2" on:click={cancelDelete}>
					Cancel
				</button>
				<button class="btn-primary" on:click={confirmDelete}> Proceed </button>
			</div>
		</div>
	</section>
</Modal>

<!-- Edit type modal -->
<Modal bind:isOpen={isEditModalOpen} on:close={cancelEdit}>
	<section slot="modal-header">Edit Type</section>
	<section slot="modal-body">
		{#if submissionError}
			<div class="w-fit">
				<Notification type="error">
					{submissionError}
				</Notification>
			</div>
		{/if}
		<form class="w-full" on:submit|preventDefault={confirmEdit}>
			<div>
				<p class="text-base text-gray-400">Name</p>
				<input
					type="text"
					name="name"
					disabled={isSubmitting}
					required
					bind:value={editTransactionData.name}
				/>
			</div>
			<div>
				<p class="text-base text-gray-400">Code</p>
				<input
					type="text"
					name="code"
					disabled={isSubmitting}
					required
					bind:value={editTransactionData.value}
				/>
			</div>
			<div class="text-right pt-6">
				<button class="btn-secondary btn-outline mr-2" on:click={cancelEdit}>
					Cancel
				</button>
				<button class="btn-primary" on:click={confirmDelete}> Proceed </button>
			</div>
		</form>
	</section>
</Modal>
